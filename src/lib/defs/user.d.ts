declare module "@editorjs/list";
declare module "@editorjs/image";
declare module "@editorjs/simple-image";
declare module "editorjs-hyperlink";

interface UserProfile {
  sub: string;
}

interface Page {
  _id: string;
  _key: string;
  title: string;
  content: any;
}

interface LayoutData {
  user: UserProfile;
  pages: Page[];
}

interface PageProps {
  page: Page;
}
