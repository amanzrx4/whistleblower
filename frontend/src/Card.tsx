// import { Button, Card, Image, Text } from "@mantine/core";
import {
  ActionIcon,
  Card,
  Center,
  Group,
  Text,
  createStyles,
  rem,
} from "@mantine/core";
import { IconBookmark, IconHeart, IconShare } from "@tabler/icons-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Data } from "./App";

dayjs.extend(relativeTime);
interface Props extends Data {}

const SubmissionCard = ({ message, createdAt }: Props) => {
  const showTime = dayjs(createdAt).fromNow();

  const useStyles = createStyles((theme) => ({
    card: {
      position: "relative",
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    },

    rating: {
      position: "absolute",
      top: theme.spacing.xs,
      right: rem(12),
      pointerEvents: "none",
    },

    title: {
      display: "block",
      marginTop: theme.spacing.md,
      marginBottom: rem(5),
    },

    action: {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      ...theme.fn.hover({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[5]
            : theme.colors.gray[1],
      }),
    },

    footer: {
      marginTop: theme.spacing.md,
    },
  }));
  const { classes, theme } = useStyles();

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{
        userSelect: "none",
      }}
    >
      {/* <Image
          src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
          height={160}
          alt="Norway"
        /> */}

      {/* <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>Norway Fjord Adventures</Text>
        <Badge color="pink" variant="light">
          On Sale
        </Badge>
      </Group> */}

      <Text style={{ textAlign: "start" }} size="sm" color="dark">
        {message}
      </Text>

      <Group position="apart" className={classes.footer}>
        <Center>
          <Text fz="sm" inline color="dimmed">
            {"-"} {showTime}
          </Text>
        </Center>

        <Group spacing={8} mr={0}>
          <ActionIcon className={classes.action}>
            <IconHeart size="1rem" color={theme.colors.red[6]} />
          </ActionIcon>
          <ActionIcon className={classes.action}>
            <IconBookmark size="1rem" color={theme.colors.yellow[7]} />
          </ActionIcon>
          <ActionIcon className={classes.action}>
            <IconShare size="1rem" />
          </ActionIcon>
        </Group>
      </Group>
      {/* </Card.Section> */}

      {/* <Button variant="light" color="blue" fullWidth mt="md" radius="md">
        Like
      </Button> */}
    </Card>
  );
};

export default SubmissionCard;
