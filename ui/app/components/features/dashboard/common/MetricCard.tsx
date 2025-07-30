import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useSpring, animated } from "react-spring";
import { ReactNode } from "react";
import { Skeleton } from "~/components/ui/skeleton";

interface CardProps {
  title: string;
  icon: JSX.Element;
  description?: string | ReactNode;
  value: string | number;
  animation: boolean;
  decimalPlaces?: number;
  loading?: boolean;
}

const Number = ({
  n,
  decimalPlaces,
}: {
  n: number;
  decimalPlaces?: number;
}) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: n,
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 },
  });

  return (
    <animated.div>
      {number.to((n) => n.toFixed(decimalPlaces ? decimalPlaces : 0))}
    </animated.div>
  );
};

const MetricCard = ({
  title,
  icon,
  description,
  value,
  animation,
  decimalPlaces,
  loading,
}: CardProps) => {
  return loading ? (
    <Card>
      <CardContent className="h-full flex flex-col justify-center">
        <div className="space-y-2">
          <Skeleton className="h-4 w-[225px]" />
          <Skeleton className="h-4 w-[180px]" />
          <Skeleton className="h-4 w-[140px]" />
        </div>
      </CardContent>
    </Card>
  ) : (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {animation && typeof value === "number" ? (
            <Number n={value} decimalPlaces={decimalPlaces} />
          ) : (
            value
          )}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
