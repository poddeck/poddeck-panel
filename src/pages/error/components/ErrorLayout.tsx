import MotionContainer from "@/components/animate/motion-container";
import {varBounce} from "@/components/animate/variants/bounce";
import {Button} from "@/components/ui/button";
import {m} from "motion/react";
import type {ReactNode} from "react";
import {Helmet} from "react-helmet";
import {NavLink} from "react-router";
import {useTranslation} from "react-i18next";

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
                                      description
                                    }: ErrorLayoutProps) {
  const {t} = useTranslation();
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div
        className="m-auto max-w-[600px] flex items-center justify-center h-full">
        <MotionContainer
          className="flex flex-col items-center justify-center px-2 w-full gap-2">
          <m.div variants={varBounce().in}>
            <h2
              className="text-center text-4xl font-bold tracking-tighter sm:text-5xl">
              {title}
            </h2>
          </m.div>
          {description && (
            <m.div variants={varBounce().in}>
              <p className="text-center text-gray-500">
                {description}
              </p>
            </m.div>
          )}
          <NavLink to={"/"} className="mt-6 w-full flex justify-center">
            <Button size="lg">
              {t("error.return")}
            </Button>
          </NavLink>
        </MotionContainer>
      </div>
    </>
  );
}