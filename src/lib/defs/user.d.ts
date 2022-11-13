declare module "@editorjs/list";
declare module "@editorjs/image";
declare module "@editorjs/simple-image";
declare module "@editorjs/link-autocomplete";
declare module "@editorjs/marker";
declare module "editorjs-hyperlink";

interface UserProfile {
  user_id: string;
  user_metadata: {
    activePond?: string;
  };
  ponds: Pond[];
}

interface Pond {
  _id: string;
  _key: string;
  title: string;
  ownerId: string;
  private: boolean;
  lastEdited: string;
  pages: Page[];
}

interface Page {
  _id: string;
  _key: string;
  title: string;
  content: PageContent;
  ownerId: string;
  private: boolean;
  lastEdited: string;
  ponds?: Pond[];
}

interface PageContent {
  time: number;
  blocks: any[];
  version: string;
}

interface PageEdge {
  _id: string;
  _key: string;
  _from: string;
  _to: string;
  target: Page;
}

interface LayoutData {
  user: UserProfile;
  ponds: Pond[];
}

interface PondProps {
  pond?: Pond;
}
