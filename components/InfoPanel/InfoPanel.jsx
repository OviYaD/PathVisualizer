"use client";

import styles from "./InfoPanel.module.scss";

export default function InfoPanel({ algorithm }) {
  return (
    <div className={styles.infoPanel}>
      <div className={styles.infoHeader}>
        <h2 className={styles.infoName}>{algorithm.label}</h2>
        <span className={styles.infoStable}>{algorithm.optimal ? "guarantees shortest path" : "not guaranteed shortest"}</span>
        {algorithm.weighted && <span className={styles.infoWeighted}>respects weighted terrain</span>}
      </div>
      <p className={styles.infoDescription}>{algorithm.description}</p>

      <div className={styles.infoBody}>
        <dl className={styles.complexityGrid}>
          <div className={styles.complexityCell}>
            <dt>time</dt>
            <dd>O({algorithm.complexity.time})</dd>
          </div>
          <div className={styles.complexityCell}>
            <dt>space</dt>
            <dd>O({algorithm.complexity.space})</dd>
          </div>
          <div className={styles.complexityCell}>
            <dt>optimal path</dt>
            <dd>{algorithm.optimal ? "yes" : "no"}</dd>
          </div>
          <div className={styles.complexityCell}>
            <dt>weighted</dt>
            <dd>{algorithm.weighted ? "yes" : "no"}</dd>
          </div>
        </dl>

        <div className={styles.codeBlock}>
          <div className={styles.codeHeader}>
            <span className={styles.codeDot} />
            <span className={styles.codeDot} />
            <span className={styles.codeDot} />
            <span className={styles.codeTitle}>pseudocode</span>
          </div>
          <pre className={styles.codePre}>
            <code>
              {algorithm.pseudocode.map((line, i) => (
                <span key={i} className={styles.codeLine}>
                  <span className={styles.codeLineNumber}>{i + 1}</span>
                  <span className={styles.codeLineText}>{line || "\u00a0"}</span>
                </span>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
