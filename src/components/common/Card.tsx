import type { ComponentProps, ReactElement } from "react";

import { CARD_MAP } from "@/foundations";

type CardType = keyof typeof CARD_MAP;

type CardProps = {
  [T in CardType]: { type: T; data: ComponentProps<(typeof CARD_MAP)[T]> };
}[CardType];

const Card = (props: CardProps): ReactElement => {
  const Component = CARD_MAP[props.type] as React.ComponentType<
    typeof props.data
  >;
  return <Component {...props.data} />;
};

export default Card;
