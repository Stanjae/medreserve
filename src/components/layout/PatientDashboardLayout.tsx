"use client";
import { useDisclosure } from "@mantine/hooks";
import {
  AppShell,
  Avatar,
  Box,
  Menu,
  Burger,
  Group,
  NavLink,
  Indicator,
  ActionIcon,
  Text,
  Button,
  Divider,
} from "@mantine/core";
import MedReserveLogo from "@/components/logo/MedReserveLogo";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { handleNavLinks } from "@/utils/utilsFn";
import { useMedStore } from "@/providers/med-provider";
import { CDropdown } from "../dropdown/CDropdown";
import {
  IconSettings,
  IconLogout,
  IconUserCircle,
  IconBell,
  IconSearch,
} from "@tabler/icons-react";
import useLogout from "@/hooks/useLogout";
import CustomInput from "../inputs/CustomInput";
import { ROLES } from "@/types/store.types";
import { NavList } from "@/types/table.types";
import HeaderBtns from "../CButton/HeaderBtns";

type NavProps = {
  children: React.ReactNode;
  role: ROLES;
  navigation: NavList[];
  secondaryNavigation?: NavList[];
  isSecondarySection?: boolean;
};

export default function DashboardLayout({
  navigation,
  role,
  children,
  isSecondarySection,
  secondaryNavigation,
}: Readonly<NavProps>) {
  const { credentials, adminPermissions } = useMedStore((state) => state);
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  const pathname = usePathname();
  const navigationRefined = handleNavLinks(
    role,
    adminPermissions?.type,
    credentials?.userId,
    navigation
  );

  const secondaryNavigationRefined = handleNavLinks(
    role,
    adminPermissions?.type,
    credentials?.userId,
    secondaryNavigation as NavList[]
  );

  const { logoutPatient } = useLogout();

  return (
    <AppShell
      suppressHydrationWarning
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <MedReserveLogo />
          <div className=" flex items-center ml-[162px]">
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="sm"
              size="sm"
            />
            <Burger
              opened={!desktopOpened}
              onClick={toggleDesktop}
              visibleFrom="sm"
              size="sm"
            />
          </div>
          <CustomInput
            label={""}
            w={300}
            size="md"
            radius={"md"}
            placeholder="Search or type command..."
            type="text"
            leftSection={<IconSearch />}
            rightSection={
              <ActionIcon
                variant="outline"
                color="m-gray.3"
                aria-label="Search"
              >
                ⌘K
              </ActionIcon>
            }
          />
          <Group px="lg" gap={20} ml={"auto"}>
            <CDropdown
              props={{ position: "bottom-end", width: 200, shadow: "md" }}
              trigger={
                <Indicator inline label={10} size={20}>
                  <IconBell size={"25px"} />
                </Indicator>
              }
            >
              <Menu.Dropdown>
                <Menu.Label>Application</Menu.Label>
                <Menu.Item
                  className=" text-[17px]"
                  leftSection={<IconSettings size={17} />}
                >
                  Settings
                </Menu.Item>
                <Menu.Item
                  className=" text-[17px]"
                  leftSection={<IconUserCircle size={17} />}
                >
                  Profile
                </Menu.Item>

                <Menu.Divider />

                <Menu.Label>Danger zone</Menu.Label>
                <Button
                  variant="subtle"
                  className=" text-[17px]"
                  onClick={logoutPatient}
                  color="red"
                  leftSection={<IconLogout size={17} />}
                >
                  Logout
                </Button>
              </Menu.Dropdown>
            </CDropdown>
            <CDropdown
              props={{ position: "bottom-end", width: 200, shadow: "md" }}
              trigger={<Avatar name={credentials?.username} />}
            >
              <Menu.Dropdown>
                <Menu.Label>Application</Menu.Label>
                <Menu.Item
                  className=" text-[17px]"
                  leftSection={<IconSettings size={17} />}
                >
                  Settings
                </Menu.Item>
                <Menu.Item
                  className=" text-[17px]"
                  leftSection={<IconUserCircle size={17} />}
                >
                  Profile
                </Menu.Item>

                <Menu.Divider />

                <Menu.Label>Danger zone</Menu.Label>
                <Menu.Item
                  className=" text-[17px]"
                  onClick={logoutPatient}
                  color="red"
                  leftSection={<IconLogout size={17} />}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </CDropdown>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Box id="dashNavs">
          {navigationRefined?.map((item, index) => {
            const IconComponent = item.leftIcon;
            if (!item.child) {
              return (
                <NavLink
                  component={Link}
                  href={item.href}
                  active={pathname == item.href}
                  leftSection={<IconComponent size={17} stroke={1.5} />}
                  label={item.label}
                  key={index}
                  styles={{
                    label: {
                      fontSize: "17px",
                      fontWeight: 600,
                    },
                  }}
                />
              );
            } else {
              return (
                <NavLink
                  childrenOffset={28}
                  component={Link}
                  href={item.href}
                  active={pathname.includes(item.href)}
                  leftSection={<IconComponent size={17} stroke={1.5} />}
                  label={item.label}
                  key={index}
                  styles={{
                    label: {
                      fontSize: "17px",
                      fontWeight: 600,
                    },
                  }}
                >
                  {item.sub?.map((lol, opp) => (
                    <NavLink
                      active={
                        lol.href == "index"
                          ? pathname.endsWith(item.href)
                          : pathname.includes(lol.href)
                      }
                      label={lol.label}
                      component={Link}
                      key={opp}
                      href={
                        lol.href == "index"
                          ? item.href
                          : `${item.href}/${lol.href}`
                      }
                      styles={{
                        label: {
                          fontSize: "15px",
                          fontWeight: 500,
                        },
                        root: { backgroundColor: "transparent" },
                      }}
                    />
                  ))}
                </NavLink>
              );
            }
          })}
        </Box>
        {isSecondarySection && (
          <Box id="dashNavs">
            <Divider my="md" />

            <div>
              {isSecondarySection &&
                secondaryNavigationRefined?.map((item, index) => {
                  const IconComponent = item.leftIcon;
                  if (!item.child) {
                    return (
                      <NavLink
                        component={Link}
                        href={item.href}
                        active={pathname == item.href}
                        leftSection={<IconComponent size={17} stroke={1.5} />}
                        label={item.label}
                        key={index}
                        styles={{
                          label: {
                            fontSize: "17px",
                            fontWeight: 600,
                          },
                        }}
                      />
                    );
                  } else {
                    return (
                      <NavLink
                        childrenOffset={28}
                        component={Link}
                        href={item.href}
                        active={pathname.includes(item.href)}
                        leftSection={<IconComponent size={17} stroke={1.5} />}
                        label={item.label}
                        key={index}
                        styles={{
                          label: {
                            fontSize: "17px",
                            fontWeight: 600,
                          },
                        }}
                      >
                        {item.sub?.map((lol, opp) => (
                          <NavLink
                            active={
                              lol.href == "index"
                                ? pathname.endsWith(item.href)
                                : pathname.includes(lol.href)
                            }
                            label={lol.label}
                            component={Link}
                            key={opp}
                            href={
                              lol.href == "index"
                                ? item.href
                                : `${item.href}/${lol.href}`
                            }
                            styles={{
                              label: {
                                fontSize: "15px",
                                fontWeight: 500,
                              },
                              root: { backgroundColor: "transparent" },
                            }}
                          />
                        ))}
                      </NavLink>
                    );
                  }
                })}
            </div>
          </Box>
        )}
      </AppShell.Navbar>
      <AppShell.Main bg={"#F8F8F8"}>
        <div>
          <Group justify="space-between">
            <Text className=" capitalize font-semibold" fz={"h3"}>
              {pathname
                .split("/")
                .at(pathname.split("/").length - 1)
                ?.replaceAll("-", " ")}
            </Text>
            <HeaderBtns />
          </Group>
        </div>
        <Box mt={15}>{children}</Box>
      </AppShell.Main>
    </AppShell>
  );
}
