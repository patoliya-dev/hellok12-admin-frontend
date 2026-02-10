import Button from "./Button";

const Modal = ({ title, children, onClose, width = "max-w-2xl w-full" }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={`${width} bg-card border border-border rounded-lg max-h-[90vh] overflow-y-auto shadow-large`}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-semibold text-brand-gray-800">{title}</h2>
          <Button variant="ghost" size="icon" iconName="X" onClick={onClose} />
        </div>
        <div className="">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
