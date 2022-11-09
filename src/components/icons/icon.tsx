// import { component$ } from "@builder.io/qwik";

interface IconProps {
  name: string;
  style?: any;
}

export default (props: IconProps) => {
  const { name } = props;
  return (
    <svg viewBox="0 0 24 24" style={props.style || null}>
      <use href={`#${name}`} />
    </svg>
  );
};
