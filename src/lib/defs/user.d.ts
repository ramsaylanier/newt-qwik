declare module "@editorjs/list";

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
