import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import RoleBasedHeader from "components/ui/RoleBasedHeader";
import PageHeader from "components/ui/PageHeader";
import SearchBar from "components/ui/SearchBar";
import Loader from "components/ui/Loader";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";

import { fetchSchools, updateUser } from "reducers/superAdmin/superAdminThunks";
import {
  selectSchools,
  selectSchoolsPagination,
  selectReq,
} from "reducers/superAdmin/superAdminSlice";

import {
  fetchInvitations,
  cancelInvitation,
} from "reducers/invitations/invitationsThunks";
import {
  selectInvitations,
  selectInvitationsLoading,
  selectInvitationsPagination,
} from "reducers/invitations/invitationsSlice";

import { successToast, errorToast } from "../../../utils/utils";
import SchoolsTable from "./components/SchoolsTable";
import EditSchoolModal from "./components/EditSchoolModal";
import InviteSchoolModal from "./components/InviteSchoolModal";
import InvitationTable from "../components/InvitationTable";

const listPageSize = 10;
const invPageSize = 10;

const ManageSchools = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // tabs: list | invitations
  const [activeTab, setActiveTab] = useState("list");

  // list
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // modals
  const [editOpen, setEditOpen] = useState(false);
  const [editSchool, setEditSchool] = useState(null);

  const [inviteOpen, setInviteOpen] = useState(false);

  // invitations
  const [invSearch, setInvSearch] = useState("");
  const [invPage, setInvPage] = useState(1);

  const schools = useSelector(selectSchools);
  const pagination = useSelector(selectSchoolsPagination);

  const req = useSelector(selectReq("fetchSchools"));
  const loading = req?.status === "loading";

  const updateReq = useSelector(selectReq("updateUser"));
  const saving = updateReq?.status === "loading";

  const buildListParams = useCallback(() => {
    return {
      page,
      limit: listPageSize,
      search: search || undefined,
    };
  }, [page, search]);

  useEffect(() => {
    if (activeTab !== "list") return;
    dispatch(fetchSchools(buildListParams()));
  }, [dispatch, activeTab, buildListParams]);

  // invitations (role=school)
  const inviteRole = "school";

  const invitations = useSelector((s) =>
    selectInvitations(s, inviteRole, invSearch, invPage, invPageSize),
  );
  const invLoading = useSelector((s) =>
    selectInvitationsLoading(s, inviteRole, invSearch, invPage, invPageSize),
  );
  const invPagination = useSelector((s) =>
    selectInvitationsPagination(s, inviteRole, invSearch, invPage, invPageSize),
  );

  const callInvitations = useCallback(() => {
    return dispatch(
      fetchInvitations({
        role: inviteRole,
        search: invSearch,
        page: invPage,
        limit: invPageSize,
      }),
    );
  }, [dispatch, inviteRole, invSearch, invPage]);

  useEffect(() => {
    if (activeTab !== "invitations") return;
    callInvitations();
  }, [activeTab, callInvitations]);

  useEffect(() => {
    (() => {
      if (activeTab === "list") setPage(1);
    })();
  }, [search, activeTab]);

  useEffect(() => {
    (() => {
      if (activeTab === "invitations") setInvPage(1);
    })();
  }, [invSearch, activeTab]);

  const handleSearch = useCallback(
    (term) => {
      if (activeTab === "list") setSearch(term);
      else setInvSearch(term);
    },
    [activeTab],
  );

  const onCancelInvite = useCallback(
    async (inv) => {
      try {
        await dispatch(
          cancelInvitation({
            invitationId: inv._id,
            role: inviteRole,
            search: invSearch || "",
            page: invPage,
            limit: invPageSize,
          }),
        ).unwrap();

        successToast("Invitation cancelled");
        await callInvitations();
      } catch (e) {
        errorToast(e || "Failed to cancel invitation");
      }
    },
    [dispatch, inviteRole, invSearch, invPage, callInvitations],
  );

  const invitationTotalCount = invPagination?.total ?? invitations?.length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        <PageHeader
          title="Manage Schools"
          description="Manage and oversee all schools across the platform"
          isButton
          iconName="UserPlus"
          buttonTitle="Invite School"
          onButtonClick={() => setInviteOpen(true)}
          studentCount={pagination?.total || 0}
          activeEntityTab="Schools"
        />

        {/* Search row */}
        <section className="my-6 w-full">
          <div className="flex flex-row gap-3 w-full">
            <div className="flex-1 min-w-0">
              <SearchBar
                onSearch={handleSearch}
                placeholder={"Search schools name"}
              />
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="border-b border-border mb-6">
          <nav className="flex space-x-8 gap-2 overflow-x-auto">
            {[
              { id: "list", label: "Schools", count: pagination?.total },
              {
                id: "invitations",
                label: "Invitations",
                count: invitationTotalCount,
              },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`
                  flex items-center gap-2 py-[18px] px-1 border-b-2 font-medium text-sm transition-smooth
                  ${
                    activeTab === t.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                  }
                `}
              >
                {t.label} ({t.count || 0})
              </button>
            ))}
          </nav>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : activeTab === "list" ? (
          <SchoolsTable
            rows={schools || []}
            pagination={pagination}
            onPageChange={setPage}
            onEdit={(u) => {
              navigate(`/admin/schools/${u._id}`);
            }}
          />
        ) : (
          <InvitationTable
            title="School invitations"
            invitations={invitations}
            pagination={invPagination}
            loading={invLoading}
            onCancel={onCancelInvite}
            showRole={false}
            onPageChange={setInvPage}
          />
        )}
      </main>

      <EditSchoolModal
        isOpen={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditSchool(null);
        }}
        school={editSchool}
        saving={saving}
        onSave={async (payload) => {
          try {
            await dispatch(
              updateUser({
                userId: editSchool._id,
                entity: "schools",
                payload,
              }),
            ).unwrap();
            successToast("School updated");
            setEditOpen(false);
            setEditSchool(null);
            dispatch(fetchSchools(buildListParams()));
          } catch (e) {
            errorToast(e?.message || e?.error || "Failed to update school");
          }
        }}
      />

      <InviteSchoolModal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSuccess={() => {
          successToast("Invitation sent successfully!");
          if (activeTab === "invitations") callInvitations();
        }}
      />
    </div>
  );
};

export default ManageSchools;
