import {
  ActionIcon,
  Card,
  Center,
  Group,
  Popover,
  Text,
  createStyles,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import {
  IconBookmark,
  IconDiscountCheckFilled as IconDiscountCheck,
  IconHeart,
  IconShare,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Data, ProofObj } from "./App";

dayjs.extend(relativeTime);
interface Props extends Data {}

const SubmissionCard = ({ message, updatedAt, proof }: Props) => {
  const [opened, { close, open }] = useDisclosure(false);
  const showTime = dayjs(updatedAt).fromNow();

  const parsedProof = JSON.parse(proof) as ProofObj[];

  const proofObjectToShow = parsedProof.map((i) => {
    return {
      provider: i.provider + "\n",
      ownerPublicKey: i.ownerPublicKey,
      timestampS: i.timestampS,
      witnessAddresses: i.witnessAddresses,
      signatures: i.signatures,
      redactedParameters: JSON.stringify(
        JSON.parse(i.redactedParameters),
        null,
        2
      ),
      identifier: i.identifier,
      epoch: i.epoch,
      context: i.context,
    };
  });

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
    <>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        style={{
          userSelect: "none",
          overflow: "visible",
        }}
      >
        <Group position="apart" style={{ position: "relative" }}>
          <Text style={{ textAlign: "start" }} size="sm" color="dark">
            {message}
          </Text>

          <Group spacing={4} style={{ position: "relative" }}>
            <IconDiscountCheck
              size="1rem"
              style={{
                color: theme.colors.blue[6],
              }}
            />
            <Popover
              opened={opened}
              position="bottom"
              clickOutsideEvents={["mouseup", "touchend"]}
            >
              <Popover.Target>
                <Text
                  style={{
                    textAlign: "start",
                    cursor: "pointer",
                  }}
                  size="sm"
                  underline
                  color="blue"
                  onMouseEnter={open}
                  onMouseLeave={close}
                >
                  Verified
                </Text>
              </Popover.Target>

              <Popover.Dropdown
                style={{
                  pointerEvents: "none",
                }}
              >
                <Text size="sm" color="black" align="start">
                  {proofObjectToShow.map((i) => {
                    return Object.keys(i).map((key) => {
                      return (
                        <Text pb={10} inline>
                          <Text weight={"bold"} inline>
                            {key}:
                          </Text>{" "}
                          {i[key as keyof typeof i]}
                        </Text>
                      );
                    });
                  })}
                </Text>
              </Popover.Dropdown>
            </Popover>
          </Group>
        </Group>

        <Group position="apart" className={classes.footer}>
          <Center>
            <Text fz="sm" inline color="dimmed">
              {"~"} {showTime}
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
    </>
  );
};

export default SubmissionCard;
