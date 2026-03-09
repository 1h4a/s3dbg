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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    SelectSeparator
} from "@/components/ui/select";

import { clientConfig, senderConfig, parseValue } from "@/lib/fields";
import type {
  ConfigSchema,
  Field as FieldSchema,
  Section,
} from "@/lib/fields";

import { s3Requests } from "@/lib/requests";

import { useRef, useState, useEffect } from "react";

type ConfigValues = Record<string, Record<string, any>>;

export function RequestInterface({ className }: { className?: string }) {
    const handleSend = async () => {}

    return (<div
        className={
            "w-full h-full flex flex-col items-start justify-start gap-4 p-4 outline-1 outline-neutral-800 rounded-sm " +
            className
        }
    >
        <div
            className="flex-col p-4 items-start justify-start w-full h-full outline-neutral-700 outline-1 rounded-sm"
            id="request_send"
        >
            <p className="pb-4"> Requests </p>
            <Field>
                <FieldLabel>Request Type</FieldLabel>
                <Select>
                    <SelectTrigger className="w-full max-w-48">
                        <SelectValue placeholder="Request Type" />
                    </SelectTrigger>
                    <SelectContent>
                        {s3Requests.map((group, index) => (
                            <div key={`con-${group.section}`}>
                                {index > 0 && <SelectSeparator key={`sep-${group.section}`} />}
                                <SelectGroup key={group.section}>
                                    <SelectLabel>{group.section}</SelectLabel>
                                    {group.requests.map((request) => (
                                        <SelectItem key={request.id} value={request.id}>
                                            {request.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </div>
                        ))}
                    </SelectContent>
                </Select>
                <FieldDescription> The request type to send. </FieldDescription>
            </Field>
            <span className="flex flex-row gap-4 pt-8 w-full items-end justify-end">
        <Button
            className="active:opacity-50"
            type="button"
            variant="outline"
            onClick={handleSend}
        >
          {" "}
            Send Request{" "}
        </Button>
      </span>
        </div>
    </div>)
}

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
  onReset?: () => Promise<void>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [resetKey, setResetKey] = useState(0);
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
      await onReset();
      setResetKey((k) => k + 1);
    }
  };

  return (
    <form
      key={resetKey}
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
