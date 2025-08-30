import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import Bold from "@tiptap/extension-bold";
import { Markdown } from "tiptap-markdown-3";
import { cn } from "@/lib/utils.ts";

type Props = {
  readonly className?: string;
  readonly value: string;
  readonly onChange: (value: string | undefined) => void;
};

export const MarkdownEditor: React.FC<Props> = ({
  value,
  onChange,
  className,
}) => {
  const editor = useEditor({
    content: value,
    extensions: [Document, Paragraph, Text, Bold, Markdown],
    onUpdate: () => {
      // @ts-expect-error markdown support is not typed
      onChange(editor.storage.markdown.getMarkdown());
    },
  });
  return (
    <EditorContent
      editor={editor}
      className={cn("[&_div]:outline-none", className)}
    />
  );
};
