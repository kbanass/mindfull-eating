import type { MealLocal } from "shared";

import styles from "./TriggerSummary.module.css";
import { getTriggerProcentages } from "../../utils/meal";
import { useReducedMotion, motion, useInView } from "motion/react";
import { triggerEmojis, triggerLabels } from "../../utils/constants";
import { useRef } from "react";

type TriggerSummaryProps = {
  meals: Array<MealLocal[]> | undefined;
};

type Trigger = MealLocal["trigger"];

type Segment = {
  trigger: Trigger;
  percent: number;
  fraction: number;
  start: number;
};

const CHART_WIDTH = 200;
const CHART_HEIGHT = 200;
const CHART_STROKE = 30;
const CHART_RADIUS = 70;
const RING_DURATION = 0.5;

export function TriggerSummary({ meals }: TriggerSummaryProps) {
  const shouldReduceMotion = useReducedMotion();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(wrapperRef, { once: true, amount: 0.8 });

  const show = shouldReduceMotion || isInView;

  const procentages = getTriggerProcentages(meals);

  const sortedEntries = Object.entries(procentages)
    .filter(([, percentage]) => percentage > 0)
    .sort((a, b) => b[1] - a[1]);

  const segments: Segment[] = [];
  let lastEnd = 0;
  for (let i = 0; i < sortedEntries.length; i++) {
    segments.push({
      trigger: sortedEntries[i][0] as Trigger,
      percent: sortedEntries[i][1],
      fraction: sortedEntries[i][1] / 100,
      start: lastEnd,
    });
    lastEnd += sortedEntries[i][1] / 100;
  }

  return (
    <section className={styles.section}>
      <h3>Dlaczego jem?</h3>

      <div ref={wrapperRef} className={`${styles.chartWrapper} card`}>
        <motion.svg
          initial={{ opacity: 0 }}
          animate={{ opacity: show ? 1 : 0 }}
          className={styles.chart}
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          width={CHART_WIDTH}
          height={CHART_HEIGHT}
        >
          <g
            transform={`translate(${CHART_WIDTH / 2}, ${CHART_HEIGHT / 2}) rotate(-90)`}
          >
            <circle
              r={CHART_RADIUS}
              fill="none"
              stroke="#eee"
              strokeWidth={CHART_STROKE}
            />
            {segments.map((segment) => {
              return (
                <motion.circle
                  className={styles.chartSegment}
                  data-trigger={segment.trigger}
                  key={segment.trigger}
                  r={CHART_RADIUS}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={CHART_STROKE}
                  initial={{ pathLength: 0, pathOffset: segment.start }}
                  animate={{ pathLength: show ? segment.fraction : 0 }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : {
                          duration: segment.fraction * RING_DURATION,
                          delay: segment.start * 0.2,
                          ease: "easeInOut",
                        }
                  }
                />
              );
            })}
          </g>
          {segments[0] && (
            <g>
              <text
                x={CHART_WIDTH / 2}
                y={CHART_HEIGHT / 2 - 8}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={32}
                fontWeight="bold"
              >
                {triggerEmojis[segments[0].trigger]}
              </text>
              <text
                x={CHART_WIDTH / 2}
                y={CHART_HEIGHT / 2 + 16}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={16}
              >
                {triggerLabels[segments[0].trigger] +
                  " " +
                  segments[0].percent +
                  "%"}
              </text>
            </g>
          )}
        </motion.svg>
        <ul className={styles.legend}>
          {segments.map((seg, i) => (
            <motion.li
              key={seg.trigger}
              data-trigger={seg.trigger}
              className={styles.legendItem}
              initial={{ opacity: 0, y: 10 }}
              animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{
                duration: 0.4,
                delay: shouldReduceMotion ? 0 : RING_DURATION + i * 0.06,
                ease: "easeOut",
              }}
            >
              <span className={styles.dot} data-trigger={seg.trigger} />
              <span className={styles.icon}>{triggerEmojis[seg.trigger]} </span>
              <span className={styles.label}>
                {triggerLabels[seg.trigger]}{" "}
              </span>
              <span className={styles.value}>{seg.percent}%</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
