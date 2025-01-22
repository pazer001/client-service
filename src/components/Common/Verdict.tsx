import React from 'react'

interface IVerdictProps {
  score: number
  minBuy: number
  minSell: number
}
const Verdict = ({ score, minBuy, minSell }: IVerdictProps) => {
  if (score > minBuy) {
    return (
      <>
        <span className="flex align-items-center gap-1 text-green-400">
          Buy <i className="pi pi-arrow-circle-up" />
        </span>
      </>
    )
  } else if (score < minSell) {
    return (
      <>
        <span className="flex align-items-center gap-1 text-red-400">
          Sell <i className="pi pi-arrow-circle-down" />
        </span>
      </>
    )
  } else if (score >= minSell && score <= minBuy) {
    return (
      <>
        <span className="flex align-items-center gap-1 text-gray-400">
          Hold <i className="pi pi-pause-circle" />
        </span>
      </>
    )
  } else {
    return null
  }
}

export default React.memo(Verdict)
