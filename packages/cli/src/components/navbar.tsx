const Navbar = () => {
  return (
    <box
    backgroundColor={'black'}
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      borderStyle="heavy"
      borderColor="gray"
      border={["bottom"]}
      paddingX={1}
      flexShrink={0}
      height="auto"
      zIndex={1}
    >
      <box flexDirection="row" alignItems="center" gap={2}>
        <ascii-font font="tiny" text="Shift" color="orange" />
        <ascii-font font="tiny" text="Tab" color="gray" />
      </box>
    </box>
  );
};

export default Navbar;