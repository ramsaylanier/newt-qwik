import { component$ } from "@builder.io/qwik";
import Tooltip from "./tooltip/tooltip";
import { Link } from "@builder.io/qwik-city";

interface PageLinkProps {
  page: Page;
  className?: string;
  style?: any;
}

export default component$(({ page, style }: PageLinkProps) => {
  return (
    <Tooltip title={page.title}>
      <Link href={`/page/${page._key}`} style={style}>
        {page.title}
      </Link>
    </Tooltip>
  );
});
