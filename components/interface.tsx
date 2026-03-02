import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function ConfigInterface({ className }: { className?: string }) {
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
          { /* Client Settings */ }
          <div className="w-full pb-4"> Client Settings </div>
          <FieldGroup className="grid max-w-full grid-cols-4">
              <Field>
                  <FieldLabel htmlFor="ackey">Access Key</FieldLabel>
                  <Input id="ackey" placeholder="" />
              </Field>
              <Field>
                  <FieldLabel htmlFor="acsecret">Secret</FieldLabel>
                  <Input id="acsecret" placeholder="" />
              </Field>
              <Field>
                  <FieldLabel htmlFor="stoken">Session Token?</FieldLabel>
                  <Input id="stoken" placeholder="" />
              </Field>
              <Field>
                  <FieldLabel htmlFor="region">Region</FieldLabel>
                  <Input id="region" defaultValue="us-east-1" />
              </Field>
              <Field>
                  <FieldLabel htmlFor="endpoint">Endpoint</FieldLabel>
                  <Input id="endpoint" defaultValue="localhost:1519" />
              </Field>
              {/*<Field>
                  <FieldLabel htmlFor="forcepath">Force Path Style</FieldLabel>
                  <span>
                      <Checkbox id="forcepath" className="aspect-square h-10" />
                  </span>
              </Field>*/}
              <Field>
                  <FieldLabel htmlFor="maxattempts">Maximum Attempts</FieldLabel>
                  <Input id="maxattempts" defaultValue="3" />
              </Field>
          </FieldGroup>

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
