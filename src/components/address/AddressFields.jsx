import Input from "components/ui/Input";
import Select from "components/ui/Select";
import { getAllCities, getAllStates } from "../../utils/utils";
import { countryOptions } from "../../pages/admin/data";

export default function AddressFields({
  value,
  // onChange,
  disabled = false,
  errors = {},
  // optional flags (keep defaults for course/booking use)
  enableCountryStateCity = true,
}) {
  const v = value || {};
  // const set = (k, val) => onChange({ ...(v || {}), [k]: val });

  const selectedCountry = v.country || "";
  const selectedState = v.state || "";
  const selectedCity = v.city || "";

  const stateOptions = getAllStates(selectedCountry) || [];
  const cityOptions = getAllCities(selectedCountry, selectedState) || [];

  // const onCountryChange = (countryIso) => {
  //   // reset dependent fields
  //   onChange({
  //     ...(v || {}),
  //     country: countryIso,
  //     state: "",
  //     city: "",
  //   });
  // };

  // const onStateChange = (stateIso) => {
  //   // reset dependent field
  //   onChange({
  //     ...(v || {}),
  //     state: stateIso,
  //     city: "",
  //   });
  // };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Input
        label="Address Line 1"
        placeholder="House/Building, Street"
        value={v.line1 || ""}
        // onChange={(e) => set("line1", e.target.value)}
        error={errors?.line1}
        required
        disabled={disabled}
      />

      <Input
        label="Address Line 2"
        placeholder="Apartment, Floor"
        value={v.line2 || ""}
        // onChange={(e) => set("line2", e.target.value)}
        error={errors?.line2}
        disabled={disabled}
      />

      {enableCountryStateCity && (
        <>
          <Select
            label="Country"
            placeholder="Select Country"
            options={countryOptions}
            value={selectedCountry}
            // onChange={onCountryChange}
            searchable
            disabled={disabled}
          />

          <Select
            label="State/Province"
            placeholder="Select State/Province"
            options={stateOptions}
            value={selectedState}
            // onChange={onStateChange}
            // disabled={!selectedCountry}
            disabled={disabled}
            searchable
          />

          <Select
            label="City"
            placeholder="Select City"
            options={cityOptions}
            value={selectedCity}
            // onChange={(val) => set("city", val)}
            // disabled={!selectedCountry || !selectedState}
            disabled={disabled}
            searchable
          />
        </>
      )}

      <Input
        label="Postal Code"
        placeholder="395006"
        value={v.postalCode || ""}
        // onChange={(e) => set("postalCode", e.target.value)}
        error={errors?.postalCode}
        disabled={disabled}
      />
    </div>
  );
}
