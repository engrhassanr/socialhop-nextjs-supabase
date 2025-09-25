"use client";
import React from "react";
import css from "@/styles/Header.module.css";
import { Flex, Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import Box from "./Box";
import ModeButton from "./ModeButton";
import SidebarButton from "./SidebarButton";
const Header = () => {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <header className={css.wrapper}>
      <Box style={{ height: "100%" }}>
        <div className={css.container}>
          {/* sidbear button */}

          <div className={css.sidebarButton}>
            <SidebarButton />
          </div>

          {/* logo */}
          <Image
            src="/images/logo.png"
            width={150}
            height={40}
            alt="logo"
            className={css.logo}
            priority
          />
          {/* actions */}
          <Flex gap={25} align="center">
            <ModeButton />
            {isLoaded && (
              <>
                {isSignedIn ? (
                  <UserButton afterSignOutUrl="/sign-in" />
                ) : (
                  <Link href="/sign-in">
                    <Button type="primary" size="large">
                      Sign In
                    </Button>
                  </Link>
                )}
              </>
            )}
          </Flex>
        </div>
      </Box>
    </header>
  );
};

export default Header;
