import Image from "components/AppImage";
import Button from "./Button";
import { capitalize } from "../../utils/utils";

const DeleteModal = ({ type = "course", onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-sm w-[375px] max-h-[90vh] overflow-y-auto shadow-large p-4">
        <div className="w-28 h-28 bg-[#FF2D2D] rounded-full flex items-center justify-center mx-auto mb-8">
          <Image src="/assets/images/delete_icon.svg" alt="Delete" />
        </div>
        <div className="text-center mb-8 flex flex-col gap-2">
          <h2 className="text-brand-gray-800 text-2xl font-bold">
            Delete {capitalize(type)}
          </h2>
          <p className="text-brand-gray-800 text-sm">
            Are you sure you want to delete this {type}?
          </p>
        </div>
        <div className="flex flex-col md:flex-row md:justify-center gap-4">
          <Button variant="outline" size="lg" onClick={onClose}>
            No, Keep It.
          </Button>
          <Button variant="destructive" size="lg" onClick={onConfirm}>
            Yes, Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
