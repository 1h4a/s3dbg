import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function ConfigInterface({ className }: { className?: string }) {
  return (
    <div
      className={
        "w-full h-full flex flex-col items-start justify-start gap-4 p-4 outline-1 outline-neutral-800 rounded-sm " +
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
          <div className="w-full pb-4"><p> Sender Settings </p></div>
          <FieldGroup className="grid max-w-full grid-cols-4">
              <Field>
                  <FieldLabel htmlFor="bucket">Bucket</FieldLabel>
                  <Input id="bucket" placeholder="" />
                  <FieldDescription>
                      Bucket and Key are mandatory values and most commands will fail without them.
                  </FieldDescription>
              </Field>
              <Field>
                  <FieldLabel htmlFor="key">Key</FieldLabel>
                  <Input id="key" placeholder="" />
              </Field>
              <Field>
                  <FieldLabel htmlFor="ubody">Body</FieldLabel>
                  <Input id="ubody" placeholder="" />
                  <FieldDescription>
                      Currently only supports string bodies.
                  </FieldDescription>
              </Field>
          </FieldGroup>

          { /* i'm so sorry for this */ }

          <Collapsible>
              <CollapsibleTrigger className="hover:underline hover:underline-offset-2 transition-all duration-500 pt-4"> Copy Operations * </CollapsibleTrigger>
              <CollapsibleContent>
                  <FieldGroup className="grid max-w-full grid-cols-4 pt-4">
                      <Field>
                          <FieldLabel htmlFor="sbucket">Source Bucket?</FieldLabel>
                          <Input id="sbucket" placeholder="" />
                          <FieldDescription>
                              Source values are used for CopyObject commands.
                          </FieldDescription>
                      </Field>
                      <Field>
                          <FieldLabel htmlFor="skey">Source Key?</FieldLabel>
                          <Input id="skey" placeholder="" />
                      </Field>
                  </FieldGroup>
              </CollapsibleContent>
          </Collapsible>
          <Collapsible>
              <CollapsibleTrigger className="hover:underline hover:underline-offset-2 transition-all duration-500 pt-4">
                  Versioning *
              </CollapsibleTrigger>
              <CollapsibleContent>
                  <FieldGroup className="grid max-w-full grid-cols-4 pt-4">
                      <Field>
                          <FieldLabel htmlFor="verid">Version ID</FieldLabel>
                          <Input id="verid" placeholder="" />
                          <FieldDescription>
                              Specifies object version to operate on.
                          </FieldDescription>
                      </Field>
                  </FieldGroup>
              </CollapsibleContent>
          </Collapsible>
          <Collapsible>
              <CollapsibleTrigger className="hover:underline hover:underline-offset-2 transition-all duration-500 pt-4">
                  List Operations *
              </CollapsibleTrigger>
              <CollapsibleContent>
                  <FieldGroup className="grid max-w-full grid-cols-4 pt-4">
                      <Field>
                          <FieldLabel htmlFor="lprefix">Prefix?</FieldLabel>
                          <Input id="lprefix" placeholder="" />
                      </Field>
                      <Field>
                          <FieldLabel htmlFor="ldelimiter">Delimiter?</FieldLabel>
                          <Input id="ldelimiter" placeholder="" />
                      </Field>
                      <Field>
                          <FieldLabel htmlFor="lmaxKeys">Max Keys?</FieldLabel>
                          <Input id="lmaxKeys" placeholder="" />
                      </Field>
                      <Field>
                          <FieldLabel htmlFor="lmarker">Marker?</FieldLabel>
                          <Input id="lmarker" placeholder="" />
                      </Field>
                      <Field>
                          <FieldLabel htmlFor="lcontoken">Continuation Token?</FieldLabel>
                          <Input id="lcontoken" placeholder="" />
                      </Field>
                      <Field>
                          <FieldLabel htmlFor="lsafter">Start After?</FieldLabel>
                          <Input id="lsafter" placeholder="" />
                      </Field>
                      <Field>
                          <FieldLabel htmlFor="lkmarker">Key Marker?</FieldLabel>
                          <Input id="lkmarker" placeholder="" />
                      </Field>
                      <Field>
                          <FieldLabel htmlFor="lvidmarker">Version ID Marker?</FieldLabel>
                          <Input id="lvidmarker" placeholder="" />
                          <FieldDescription>Version ID to start listing after.</FieldDescription>
                      </Field>
                  </FieldGroup>
              </CollapsibleContent>
          </Collapsible>
          <Collapsible>
              <CollapsibleTrigger className="hover:underline hover:underline-offset-2 transition-all duration-500 pt-4">
                  Put / Upload Operations *
              </CollapsibleTrigger>
              <CollapsibleContent>
                  <FieldGroup className="grid max-w-full grid-cols-4 pt-4">
                      <Field>
                          <FieldLabel htmlFor="pbody">Body</FieldLabel>
                          <Input id="pbody" placeholder="" />
                          <FieldDescription>
                              Object content - currently only supports string bodies.
                          </FieldDescription>
                      </Field>
                      <Field>
                          <FieldLabel htmlFor="pctype">Content Type?</FieldLabel>
                          <Input id="pctype" placeholder="" />
                          <FieldDescription>
                              MIME type.
                          </FieldDescription>
                      </Field>
                      <Field>
                          <FieldLabel htmlFor="pcdisposition">Content Disposition?</FieldLabel>
                          <Input id="pcdisposition" placeholder="" />
                      </Field>
                      <Field>
                          <FieldLabel htmlFor="pcencoding">Content Encoding?</FieldLabel>
                          <Input id="pcencoding" placeholder="" />
                      </Field>
                      <Field>
                          <FieldLabel htmlFor="pccontrol">Cache Control?</FieldLabel>
                          <Input id="pccontrol" placeholder="" />
                          <FieldDescription> Caching directives for this object. </FieldDescription>
                      </Field>
                      <Field>
                          <FieldLabel htmlFor="pmetadata">Metadata?</FieldLabel>
                          <Input id="pmetadata" disabled placeholder="" />
                          <FieldDescription>
                              Metadata key-value pairs. Disabled for now.
                          </FieldDescription>
                      </Field>
                      <Field>
                          <FieldLabel htmlFor="pstorclass">Storage Class?</FieldLabel>
                          <Input id="pstorclass" placeholder="" />
                          <FieldDescription>
                              Storage class for this object. e.g. STANDARD, GLACIER, DEEP_ARCHIVE.
                          </FieldDescription>
                      </Field>
                  </FieldGroup>
              </CollapsibleContent>
          </Collapsible>
          <Collapsible>
              <CollapsibleTrigger className="hover:underline hover:underline-offset-2 transition-all duration-500 pt-4">
                  ACL *
              </CollapsibleTrigger>
              <CollapsibleContent>
                  <FieldGroup className="grid max-w-full grid-cols-4 pt-4">
                      <Field>
                          <FieldLabel htmlFor="acl">ACL?</FieldLabel>
                          <Input id="acl" placeholder="" />
                          <FieldDescription>
                              ACL to set on the object. (e.g. private, public-read, etc.)
                          </FieldDescription>
                      </Field>
                      <Field>
                          <FieldLabel htmlFor="aclgr">Grant Read?</FieldLabel>
                          <Input id="aclgr" placeholder="" />
                          <FieldDescription>
                              Grantee(s) allowed to read the object.
                          </FieldDescription>
                      </Field>
                      <Field>
                          <FieldLabel htmlFor="aclgw">Grant Write?</FieldLabel>
                          <Input id="aclgw" placeholder="" />
                      </Field>
                      <Field>
                          <FieldLabel htmlFor="aclgracp">Grant Read ACP?</FieldLabel>
                          <Input id="aclgracp" placeholder="" />
                          <FieldDescription>
                              Grantee(s) allowed to read the object's ACL.
                          </FieldDescription>
                      </Field>
                      <Field>
                          <FieldLabel htmlFor="aclgwacp">Grant Write ACP?</FieldLabel>
                          <Input id="aclgwacp" placeholder="" />
                      </Field>
                      <Field>
                          <FieldLabel htmlFor="aclgfc">Grant Full Control?</FieldLabel>
                          <Input id="aclgf" placeholder="" />
                          <FieldDescription>
                          Grantee(s) with full permissions.
                          </FieldDescription>
                      </Field>
                  </FieldGroup>
              </CollapsibleContent>
          </Collapsible>
          <Collapsible>
              <CollapsibleTrigger className="hover:underline hover:underline-offset-2 transition-all duration-500 pt-4">
                  Tagging *
              </CollapsibleTrigger>
              <CollapsibleContent>
                  <FieldGroup className="grid max-w-full grid-cols-4 pt-4">
                      <Field>
                          <FieldLabel htmlFor="tags">Tags?</FieldLabel>
                          <Input id="tags" placeholder="" disabled />
                          <FieldDescription>
                              Key-value pairs to set as tags. Disabled for now.
                          </FieldDescription>
                      </Field>
                  </FieldGroup>
              </CollapsibleContent>
          </Collapsible>
          <Collapsible>
              <CollapsibleTrigger className="hover:underline hover:underline-offset-2 transition-all duration-500 pt-4">
                  Delete *
              </CollapsibleTrigger>
              <CollapsibleContent>
                  <FieldGroup className="grid max-w-full grid-cols-4 pt-4">
                      <Field>
                          <FieldLabel htmlFor="dobjkey">Delete Object Key?</FieldLabel>
                          <Input id="dobjkey" placeholder="" />
                          <FieldDescription>
                              Specifies object key to delete.
                          </FieldDescription>
                      </Field>
                      <Field>
                          <FieldLabel htmlFor="dverid">Delete Object Version ID?</FieldLabel>
                          <Input id="dverid" placeholder="" />
                      </Field>
                      <Field>
                          <FieldLabel htmlFor="dquiet">Quiet Delete?</FieldLabel>
                          <Input id="dquiet" placeholder="" />
                          <FieldDescription>
                              If true, only report errors. Expects boolean.
                          </FieldDescription>
                      </Field>
                  </FieldGroup>
              </CollapsibleContent>
          </Collapsible>
          <Collapsible>
              <CollapsibleTrigger className="hover:underline hover:underline-offset-2 transition-all duration-500 pt-4">
                  Response Modifiers (GetObject) *
              </CollapsibleTrigger>
              <CollapsibleContent>
                  <FieldGroup className="grid max-w-full grid-cols-4 pt-4">
                      <Field>
                          <FieldLabel htmlFor="verid">Version ID</FieldLabel>
                          <Input id="verid" placeholder="" />
                      </Field>
                      <Field>
                          <FieldLabel htmlFor="verid">Version ID</FieldLabel>
                          <Input id="verid" placeholder="" />
                      </Field>
                      <Field>
                          <FieldLabel htmlFor="verid">Version ID</FieldLabel>
                          <Input id="verid" placeholder="" />
                      </Field>
                      <Field>
                          <FieldLabel htmlFor="verid">Version ID</FieldLabel>
                          <Input id="verid" placeholder="" />
                      </Field>
                      <Field>
                          <FieldLabel htmlFor="verid">Version ID</FieldLabel>
                          <Input id="verid" placeholder="" />
                      </Field>
                      <Field>
                          <FieldLabel htmlFor="verid">Version ID</FieldLabel>
                          <Input id="verid" placeholder="" />
                      </Field>
                      <Field>
                          <FieldLabel htmlFor="verid">Version ID</FieldLabel>
                          <Input id="verid" placeholder="" />
                      </Field>
                      <Field>
                          <FieldLabel htmlFor="verid">Version ID</FieldLabel>
                          <Input id="verid" placeholder="" />
                      </Field>
                      <Field>
                          <FieldLabel htmlFor="verid">Version ID</FieldLabel>
                          <Input id="verid" placeholder="" />
                      </Field>
                      <Field>
                          <FieldLabel htmlFor="verid">Version ID</FieldLabel>
                          <Input id="verid" placeholder="" />
                      </Field>
                      <Field>
                          <FieldLabel htmlFor="verid">Version ID</FieldLabel>
                          <Input id="verid" placeholder="" />
                      </Field>
                  </FieldGroup>
              </CollapsibleContent>
          </Collapsible>
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
