"use client";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { clientConfig, senderConfig, parseValue } from "@/components/fields";
import type {
  ConfigSchema,
  Field as FieldSchema,
  Section,
} from "@/components/fields";

import { useRef, useState, useEffect } from "react";

type ConfigValues = Record<string, Record<string, any>>;

export function ConfigInterface({ className }: { className?: string }) {
  const [configValues, setConfigValues] = useState<ConfigValues>({});

  const fetchConfig = async () => {
    try {
      const response = await fetch("/s3dbg/config");
      const data = await response.json();
      const values: ConfigValues = {};
      for (const config of data) {
        values[config.id] = config;
      }
      setConfigValues(values);
    } catch (error) {
      console.error("Failed to fetch config:", error);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return (
    <>
      <div
        className={
          "w-full h-full flex flex-col items-start justify-start gap-4 p-4 outline-1 outline-neutral-800 rounded-sm " +
          className
        }
      >
        <ConfigSection
          schema={clientConfig}
          values={configValues[clientConfig.id]}
          onReset={fetchConfig}
        />
        <ConfigSection
          schema={senderConfig}
          values={configValues[senderConfig.id]}
          onReset={fetchConfig}
        />
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
          Values that aren't filled are still parsed and default values are
          applied. The default value for strings is "", numbers is 0 and
          booleans is false.
        </div>
      </div>
    </>
  );
}

function FieldRenderer({ field, value }: { field: FieldSchema; value?: any }) {
  return (
    <Field>
      <FieldLabel htmlFor={field.id}>{field.label}</FieldLabel>
      <Input
        id={field.id}
        name={field.id}
        placeholder={field.placeholder}
        defaultValue={value ?? field.default}
        key={value} // Force re-render when value changes
        disabled={field.disabled}
      />
      {field.description && (
        <FieldDescription>{field.description}</FieldDescription>
      )}
    </Field>
  );
}

function SectionRenderer({
  section,
  values,
}: {
  section: Section;
  values?: Record<string, any>;
}) {
  return (
    <Collapsible>
      <CollapsibleTrigger className="hover:underline hover:underline-offset-2 transition-all duration-500 pt-4">
        {section.title}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <FieldGroup className="grid max-w-full grid-cols-4 pt-4">
          {section.fields.map((field) => (
            <FieldRenderer
              key={field.id}
              field={field}
              value={values?.[field.id]}
            />
          ))}
        </FieldGroup>
      </CollapsibleContent>
    </Collapsible>
  );
}

function ConfigSection({
  schema,
  values,
  onReset,
}: {
  schema: ConfigSchema;
  values?: Record<string, any>;
  onReset?: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const handleApply = async () => {
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const data: Record<string, any> = {};

      schema.fields.forEach((field) => {
        data[field.id] =
          parseValue(formData.get(field.id)?.toString(), field.type) ?? "";
      });
      schema.sections?.forEach((section) => {
        section.fields.forEach((field) => {
          data[field.id] =
            parseValue(formData.get(field.id)?.toString(), field.type) ?? "";
        });
      });
      const submit = await fetch("/s3dbg/config", {
        method: "POST",
        body: JSON.stringify({ ...data, id: schema.id }),
      });
    }
  };

  const handleReset = async () => {
    const reset = await fetch("/s3dbg/config", {
      method: "DELETE",
      body: JSON.stringify({ id: schema.id }),
    });
    if (reset.ok && onReset) {
      onReset();
    }
  };

  return (
    <form
      ref={formRef}
      className="flex-col p-4 items-start justify-start w-full h-full outline-neutral-700 outline-1 rounded-sm"
    >
      <div className="w-full pb-4">{schema.title}</div>
      <FieldGroup className="grid max-w-full grid-cols-4">
        {schema.fields.map((field) => (
          <FieldRenderer
            key={field.id}
            field={field}
            value={values?.[field.id]}
          />
        ))}
      </FieldGroup>
      {schema.sections?.map((section) => (
        <SectionRenderer
          key={section.title}
          section={section}
          values={values}
        />
      ))}
      <span className="flex flex-row gap-4 pt-8 w-full items-end justify-end">
        <Button
          className="active:opacity-50"
          type="button"
          variant="outline"
          onClick={handleApply}
        >
          {" "}
          Apply Settings{" "}
        </Button>
        <Button
          className="active:opacity-50"
          type="button"
          variant="outline"
          onClick={handleReset}
        >
          {" "}
          Reset{" "}
        </Button>
      </span>
    </form>
  );
}
