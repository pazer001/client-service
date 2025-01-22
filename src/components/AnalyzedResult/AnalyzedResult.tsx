import React from 'react'
import { Interval } from '../interfaces.ts'
import { useAnalyzedResult } from './AnalyzedResult.hook.ts'
import { IAnalyzedSignal } from './AnalyzedResult.interfaces.ts'
import { GaugeComponent } from 'react-gauge-component'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { Badge } from 'primereact/badge'
import { startCase } from 'lodash'
import Verdict from '../Common/Verdict.tsx'
import { Chip } from 'primereact/chip'

export interface IAnalyzedResultProps {
  symbol: string | undefined
  interval: Interval
}

const AnalyzedResult = (props: IAnalyzedResultProps) => {
  const { analyzedSignalsAndLines } = useAnalyzedResult(props)
  let analyzedSignals: IAnalyzedSignal[] = []
  let lastAnalyzedSignal: IAnalyzedSignal | undefined

  if (analyzedSignalsAndLines) {
    analyzedSignals = analyzedSignalsAndLines.analyzedSignals
    lastAnalyzedSignal = analyzedSignals[analyzedSignals.length - 1]
  }

  if (!analyzedSignalsAndLines || !lastAnalyzedSignal) {
    return null
  }

  return (
    <div>
      <h2 className="flex justify-content-center m-0">
        <Verdict
          minSell={analyzedSignalsAndLines.lines.minSell}
          minBuy={analyzedSignalsAndLines.lines.minBuy}
          score={lastAnalyzedSignal.signal}
        />{' '}
      </h2>
      <div className="flex justify-content-center m-0">
        <GaugeComponent
          style={{ width: '300px' }}
          type="semicircle"
          arc={{
            padding: 0.02,
            subArcs: [
              { limit: -100, color: 'red' },
              { limit: analyzedSignalsAndLines.lines.minSell, color: 'var(--red-400)' },
              { limit: analyzedSignalsAndLines.lines.minBuy, color: 'var(--gray-400)' },
              { limit: 100, color: 'var(--green-400)' },
            ],
          }}
          minValue={-100}
          maxValue={100}
          pointer={{ type: 'blob', animationDelay: 0 }}
          value={parseInt(String(lastAnalyzedSignal.signal))}
          labels={{
            valueLabel: {
              matchColorWithArc: true,
              formatTextValue: (v) => v.toFixed(0),
            },
          }}
        />
      </div>

      <Accordion activeIndex={0}>
        <AccordionTab
          header={
            <span className="flex align-items-center w-full">
              <span className="font-bold white-space-nowrap">Optimized Strategies</span>
              <Badge
                value={lastAnalyzedSignal.info.optimizedTechnicalAnalysisModule.signal.toFixed(0)}
                className="ml-auto"
                severity={lastAnalyzedSignal.info.optimizedTechnicalAnalysisModule.signal > 0 ? 'success' : 'danger'}
              />
            </span>
          }
        >
          <h3 className="m-1 mb-2">
            <i className="pi pi-arrow-circle-up text-green-400 mr-2" />
            Buy Reasons:
          </h3>

          <div className="card flex flex-wrap gap-2">
            {lastAnalyzedSignal.info.optimizedTechnicalAnalysisModule.info.buyReasons.map((reason, key) => (
              <Chip key={key} label={startCase(reason)} />
            ))}
          </div>
          <br />

          <h3 className="m-1 mb-2">
            <i className="pi pi-arrow-circle-down text-red-400 mr-2" />
            Sell Reasons:
          </h3>
          <div className="card flex flex-wrap gap-2">
            {lastAnalyzedSignal.info.optimizedTechnicalAnalysisModule.info.sellReasons.map((reason, key) => (
              <Chip key={key} label={startCase(reason)} />
            ))}
          </div>

          {/*<ListBox*/}
          {/*  options={lastAnalyzedSignal.info.optimizedTechnicalAnalysisModule.info.sellReasons.map((reason) =>*/}
          {/*    startCase(reason),*/}
          {/*  )}*/}
          {/*  className="w-full"*/}
          {/*/>*/}
        </AccordionTab>

        <AccordionTab
          header={
            <span className="flex align-items-center w-full">
              <span className="font-bold white-space-nowrap">Default Strategies</span>
              <Badge
                value={lastAnalyzedSignal.info.defaultTechnicalAnalysisModule.signal.toFixed(0)}
                className="ml-auto"
                severity={lastAnalyzedSignal.info.defaultTechnicalAnalysisModule.signal > 0 ? 'success' : 'danger'}
              />
            </span>
          }
        >
          <h3 className="m-1 mb-2">
            <i className="pi pi-arrow-circle-up text-green-400 mr-2" />
            Buy Reasons:
          </h3>

          <div className="card flex flex-wrap gap-2">
            {lastAnalyzedSignal.info.defaultTechnicalAnalysisModule.info.buyReasons.map((reason, key) => (
              <Chip key={key} label={startCase(reason)} />
            ))}
          </div>
          <br />

          <h3 className="m-1 mb-2">
            <i className="pi pi-arrow-circle-down text-red-400 mr-2" />
            Sell Reasons:
          </h3>
          <div className="card flex flex-wrap gap-2">
            {lastAnalyzedSignal.info.defaultTechnicalAnalysisModule.info.sellReasons.map((reason, key) => (
              <Chip key={key} label={startCase(reason)} />
            ))}
          </div>
        </AccordionTab>
      </Accordion>
    </div>
  )
}

export default React.memo(AnalyzedResult)
