import MotionContainer from "@/components/animate/motion-container";
import {varBounce} from "@/components/animate/variants/bounce";
import {Button} from "@/components/ui/button";
import {m} from "motion/react";
import type {ReactNode} from "react";
import {Helmet} from "react-helmet";
import {NavLink} from "react-router";

interface ErrorLayoutProps {
  title: string;
  description?: ReactNode;
  buttonText?: string;
  slots?: {
    footer?: ReactNode;
  };
}

export default function ErrorLayout({
                                      title,
                                      description,
                                      buttonText = "Go to Home",
                                      slots = {},
                                    }: ErrorLayoutProps) {
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div
        className="m-auto max-w-[400px] flex items-center justify-center h-full">
        <MotionContainer
          className="flex flex-col items-center justify-center px-2 w-full gap-2">
          <m.div variants={varBounce().in}>
            <h2 className="text-center">
              {title}
            </h2>
          </m.div>
          {description && (
            <m.div variants={varBounce().in}>
              <p className="text-center text-secondary">
                {description}
              </p>
            </m.div>
          )}

          {slots.footer ? (
            slots.footer
          ) : (
            <NavLink to={"/"} className="mt-4 w-full flex justify-center">
              <Button size="lg">
                {buttonText}
              </Button>
            </NavLink>
          )}
        </MotionContainer>
      </div>
    </>
  );
}