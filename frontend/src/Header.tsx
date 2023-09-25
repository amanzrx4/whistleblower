import { Center, Container, Group, Menu, Text } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import ReclaimLogo from "../assets/reclaim.svg";
import classes from "./header.module.css";

const links = [
  { link: "/", label: "Home" },
  { link: "https://docs.reclaimprotocol.org/", label: "Docs" },
  { link: "https://www.reclaimprotocol.org/", label: "Learn" },
];

const Header = () => {
  // const [opened, { toggle }] = useDisclosure(false);

  const items = links.map((link) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const menuItems = link.links?.map((item) => (
      <Menu.Item key={item.link}>{item.label}</Menu.Item>
    ));

    if (menuItems) {
      return (
        <Menu
          key={link.label}
          trigger="hover"
          transitionProps={{ exitDuration: 0 }}
          withinPortal
        >
          <Menu.Target>
            <a
              href={link.link}
              className={classes.link}
              onClick={(event) => event.preventDefault()}
            >
              <Center>
                <span className={classes.linkLabel}>{link.label}</span>
                <IconChevronDown size="0.9rem" stroke={1.5} />
              </Center>
            </a>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }
    return (
      <a
        key={link.label}
        style={{
          cursor: "pointer",
          color: "black",
          textDecoration: "underline",
        }}
        className={classes.link}
        onClick={(e) => {
          e.preventDefault();
          if (link.link === "/") {
            console.log("here", window.location.pathname);
            if (window.location.pathname === "/") {
              return window.scrollTo(0, 0);
            }
            return (window.location.href = "/");
          }
          return window.open(link.link, "_blank");
        }}
      >
        {link.label}
      </a>
    );
  });

  return (
    <header className={classes.header}>
      <Container size="md">
        <div className={classes.inner}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <ReclaimLogo
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              style={{
                borderRadius: "50%",
              }}
            />
            <Text
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                window.location.href = "https://www.reclaimprotocol.org/";
              }}
              weight="bolder"
              color="dimmed"
            >
              Powered by reclaim
            </Text>
          </div>
          <Group>{items}</Group>
        </div>
      </Container>
    </header>
  );
};

export default Header;
