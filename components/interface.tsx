"use client"

import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { clientConfig, senderConfig, parseValue } from "@/components/fields";
import type { ConfigSchema, Field as FieldSchema, Section } from "@/components/fields";

import {useRef} from "react";

export function ConfigInterface({ className }: { className?: string }) {
  return (
      <>
          <div
              className={
                  "w-full h-full flex flex-col items-start justify-start gap-4 p-4 outline-1 outline-neutral-800 rounded-sm " +
                  className
              }
          >
              <ConfigSection schema={clientConfig} />
              <ConfigSection schema={senderConfig} />
              <div
                  className="flex-col p-4 items-start justify-start w-full h-full outline-neutral-700 outline-1 rounded-sm"
                  id="logsettings"
              >
                  <p> Logging Settings </p>
              </div>
          </div>
          <div
              className={`flex flex-row w-full h-fit items-center justify-center font-medium tracking-tight`}
          >
              <div className="w-fit h-full outline-1 outline-amber-400 text-amber-400 opacity-75 text-sm text-center p-4 m-4 rounded-sm">
                  Values that aren't filled are still parsed and default values are applied. The default value for strings is "", numbers is 0 and booleans is false.
              </div>
          </div>
      </>
  )
}

/** Renders a single field */
function FieldRenderer({ field }: { field: FieldSchema }) {
  return (
    <Field>
      <FieldLabel htmlFor={field.id}>{field.label}</FieldLabel>
      <Input
        id={field.id}
        name={field.id}
        placeholder={field.placeholder}
        defaultValue={field.default}
        disabled={field.disabled}
      />
      {field.description && (
        <FieldDescription>{field.description}</FieldDescription>
      )}
    </Field>
  );
}

/** Renders a collapsible section */
function SectionRenderer({ section }: { section: Section }) {
  return (
    <Collapsible>
      <CollapsibleTrigger className="hover:underline hover:underline-offset-2 transition-all duration-500 pt-4">
        {section.title}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <FieldGroup className="grid max-w-full grid-cols-4 pt-4">
          {section.fields.map((field) => (
            <FieldRenderer key={field.id} field={field} />
          ))}
        </FieldGroup>
      </CollapsibleContent>
    </Collapsible>
  );
}

/** Renders a full config schema (title, top-level fields, sections) */
function ConfigSection({ schema }: { schema: ConfigSchema }) {
    const formRef = useRef<HTMLFormElement>(null);
    const handleApply = async () => {
        if (formRef.current) {
            const formData = new FormData(formRef.current);
            const data: Record<string, any> = {};

            schema.fields.forEach((field) => {
                data[field.id] = parseValue(formData.get(field.id)?.toString(), field.type) ?? "";
            });
            schema.sections?.forEach((section) => {
                section.fields.forEach((field) => {
                    data[field.id] = parseValue(formData.get(field.id)?.toString(), field.type) ?? "";
                });
            })
            console.log(data);
        }
    }

  return (
      <form
        ref={formRef}
        className="flex-col p-4 items-start justify-start w-full h-full outline-neutral-700 outline-1 rounded-sm"
      >
              <div className="w-full pb-4">{schema.title}</div>
              <FieldGroup className="grid max-w-full grid-cols-4">
                  {schema.fields.map((field) => (
                      <FieldRenderer key={field.id} field={field} />
                  ))}
              </FieldGroup>
              {schema.sections?.map((section) => (
                  <SectionRenderer key={section.title} section={section} />
              ))}
              <span className="flex flex-row gap-4 pt-8 w-full items-end justify-end">
            <Button className="active:opacity-50" type="button" variant="outline" onClick={handleApply}> Apply Settings </Button>
            <Button className="active:opacity-50" type="button" variant="outline"> Reset </Button>
        </span>
      </form>
  );
}