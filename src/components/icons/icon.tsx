// import { component$ } from "@builder.io/qwik";

interface IconProps {
  name: string;
}

export default (props: IconProps) => {
  const { name } = props;
  return (
    <svg viewBox="0 0 24 24">
      <use href={`#${name}`} />
    </svg>
  );
};
