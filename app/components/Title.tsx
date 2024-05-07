export function Title(props: { name: string }) {
  let name = props.name;
  return <h1 className="mx-2 text-base font-black text-white 2xl:text-3xl">{name}</h1>;
}
