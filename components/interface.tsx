export default function Interface({ className }: { className?: string }) {
  return (
    <div
      className={
        "w-full h-full grid grid-cols-1 grid-rows-3 items-start justify-start gap-4 p-4 outline-1 outline-neutral-800 rounded-sm " +
        className
      }
    >
      <div
        className="flex-col p-4 items-start justify-start w-full h-full outline-neutral-700 outline-1  rounded-sm"
        id="clsettings"
      >
        <p> Client Settings </p>
      </div>
      <div
        className="flex-col p-4 items-start justify-start w-full h-full outline-neutral-700 outline-1  rounded-sm"
        id="clsettings"
      >
        <p> Sender Settings </p>
      </div>
      <div
        className="flex-col p-4 items-start justify-start w-full h-full outline-neutral-700 outline-1  rounded-sm"
        id="clsettings"
      >
        <p> Logging Settings </p>
      </div>
    </div>
  );
}
