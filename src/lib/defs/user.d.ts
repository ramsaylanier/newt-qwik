declare module "@editorjs/list";
declare module "@editorjs/image";
declare module "@editorjs/simple-image";
declare module "@editorjs/link-autocomplete";
declare module "editorjs-hyperlink";

interface UserProfile {
  sub: string;
}

interface Page {
  _id: string;
  _key: string;
  title: string;
  content: PageContent;
  ownerId: string;
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
  pages: Page[];
}

interface PageProps {
  page: Page;
}
