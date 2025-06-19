'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2 } from 'lucide-react'

interface DeckAnalysis {
  id: string
  strategy: 'aggro' | 'control' | 'combo' | 'midrange'
  consistencyScore: number
  energyCurve: number[]
  recommendations: string[]
  warnings: string[]
  createdAt: string
}

interface DeckAnalysisCardProps {
  analysis: DeckAnalysis
}

const strategyColors = {
  aggro: 'bg-red-100 text-red-800 border-red-200',
  control: 'bg-blue-100 text-blue-800 border-blue-200', 
  combo: 'bg-purple-100 text-purple-800 border-purple-200',
  midrange: 'bg-green-100 text-green-800 border-green-200'
}

const strategyIcons = {
  aggro: TrendingUp,
  control: TrendingDown,
  combo: CheckCircle2,
  midrange: TrendingUp
}

export function DeckAnalysisCard({ analysis }: DeckAnalysisCardProps) {
  const StrategyIcon = strategyIcons[analysis.strategy]
  const maxCurveValue = Math.max(...analysis.energyCurve)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Deck Analysis</span>
          <Badge className={strategyColors[analysis.strategy]}>
            <StrategyIcon className="h-3 w-3 mr-1" />
            {analysis.strategy.charAt(0).toUpperCase() + analysis.strategy.slice(1)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Consistency Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Consistency Score</span>
            <span className="text-sm text-muted-foreground">{analysis.consistencyScore}/100</span>
          </div>
          <Progress value={analysis.consistencyScore} className="h-2" />
        </div>

        {/* Energy Curve */}
        <div>
          <h4 className="text-sm font-medium mb-3">Energy Curve</h4>
          <div className="flex items-end gap-1 h-20">
            {analysis.energyCurve.map((count, cost) => (
              <div key={cost} className="flex-1 flex flex-col items-center">
                <div 
                  className="bg-primary rounded-sm w-full min-h-[4px]"
                  style={{ 
                    height: maxCurveValue > 0 ? `${(count / maxCurveValue) * 64}px` : '4px' 
                  }}
                />
                <span className="text-xs text-muted-foreground mt-1">
                  {cost === 7 ? '7+' : cost}
                </span>
                <span className="text-xs font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Warnings */}
        {analysis.warnings.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
              Warnings
            </h4>
            <div className="space-y-1">
              {analysis.warnings.map((warning, index) => (
                <div key={index} className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
                  {warning}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {analysis.recommendations.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
              Recommendations
            </h4>
            <div className="space-y-1">
              {analysis.recommendations.map((rec, index) => (
                <div key={index} className="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-2 py-1">
                  {rec}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}