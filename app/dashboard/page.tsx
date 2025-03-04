"use client"

import { useState, useEffect } from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart3,
  BarChart,
  PieChart,
  LineChart,
  MessageSquare,
  TrendingUp,
  Users,
  LogOut,
  Settings,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { analyzeSentiment } from "../actions/analyze-sentiment"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [inputText, setInputText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [source, setSource] = useState("all")

  // Mock data for charts
  const [sentimentTrend, setSentimentTrend] = useState([
    { date: "Jan", positive: 65, neutral: 20, negative: 15 },
    { date: "Feb", positive: 58, neutral: 24, negative: 18 },
    { date: "Mar", positive: 62, neutral: 22, negative: 16 },
    { date: "Apr", positive: 70, neutral: 18, negative: 12 },
    { date: "May", positive: 72, neutral: 16, negative: 12 },
    { date: "Jun", positive: 68, neutral: 22, negative: 10 },
  ])

  const handleAnalyze = async () => {
    if (!inputText.trim()) return

    setIsAnalyzing(true)
    try {
      const result = await analyzeSentiment(inputText)
      setAnalysisResult(result)
    } catch (error) {
      console.error("Error analyzing sentiment:", error)
      // You might want to show an error message to the user here
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Get sentiment icon based on sentiment values
  const getSentimentIcon = (positive: number, negative: number) => {
    if (positive >= 60) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (negative >= 40) return <AlertTriangle className="h-5 w-5 text-red-500" />;
    return <Info className="h-5 w-5 text-yellow-500" />;
  }

  // Get sentiment color class based on sentiment values
  const getSentimentColorClass = (positive: number, negative: number) => {
    if (positive >= 60) return "text-green-500";
    if (negative >= 40) return "text-red-500";
    return "text-yellow-500";
  }

  // Function to determine overall sentiment color
  const getOverallSentimentColor = () => {
    if (analysisResult?.positive > analysisResult?.negative && analysisResult?.positive > analysisResult?.neutral) {
      return "bg-green-500"; // Positive
    } else if (analysisResult?.neutral > analysisResult?.positive && analysisResult?.neutral > analysisResult?.negative) {
      return "bg-yellow-500"; // Neutral
    } else if (analysisResult?.negative > analysisResult?.positive && analysisResult?.negative > analysisResult?.neutral) {
      return "bg-red-500"; // Negative
    } else {
      return "bg-gray-500"; // Default or mixed
    }
  };

  // Simulate initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      setIsAnalyzing(true)
      try {
        const result = await analyzeSentiment("I really love this product! The quality is excellent and customer service was very helpful.")
        setAnalysisResult(result)
      } catch (error) {
        console.error("Error loading initial data:", error)
      } finally {
        setIsAnalyzing(false)
      }
    }

    loadInitialData()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <BarChart3 className="h-6 w-6 text-primary" />
          <span className="hidden md:inline">SentimentIQ</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="icon" className="rounded-full">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button>
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <div className="grid flex-1 md:grid-cols-[240px_1fr]">
        <aside className="hidden border-r md:block">
          <div className="flex h-full flex-col gap-2 p-4">
            <div className="px-2 py-2">
              <h2 className="px-4 text-lg font-semibold tracking-tight">Dashboard</h2>
            </div>
            <div className="flex-1">
              <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
                <Button
                  variant={activeTab === "overview" ? "secondary" : "ghost"}
                  className="justify-start"
                  onClick={() => setActiveTab("overview")}
                >
                  <BarChart className="mr-2 h-4 w-4" />
                  Overview
                </Button>
                <Button
                  variant={activeTab === "analysis" ? "secondary" : "ghost"}
                  className="justify-start"
                  onClick={() => setActiveTab("analysis")}
                >
                  <PieChart className="mr-2 h-4 w-4" />
                  Sentiment Analysis
                </Button>
                <Button
                  variant={activeTab === "trends" ? "secondary" : "ghost"}
                  className="justify-start"
                  onClick={() => setActiveTab("trends")}
                >
                  <LineChart className="mr-2 h-4 w-4" />
                  Trends
                </Button>
                <Button
                  variant={activeTab === "sources" ? "secondary" : "ghost"}
                  className="justify-start"
                  onClick={() => setActiveTab("sources")}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Feedback Sources
                </Button>
              </nav>
            </div>
            <Button variant="outline" className="justify-start mt-auto">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </aside>
        <main className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold md:text-2xl">Sentiment Analysis Dashboard</h1>
            <Button variant="outline" size="sm" className="ml-auto gap-1 md:hidden">
              <BarChart className="h-4 w-4" />
              Menu
            </Button>
          </div>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="sources">Sources</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">78150</div>
                    <p className="text-xs text-muted-foreground">+12.5% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Positive Sentiment</CardTitle>
                    <div className="flex items-center gap-1">
                      <div className="h-4 w-4 rounded-full bg-green-500" />
                      <span className="text-xs">😄</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">88%</div>
                    <p className="text-xs text-muted-foreground">+2.3% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Neutral Sentiment</CardTitle>
                    <div className="flex items-center gap-1">
                      <div className="h-4 w-4 rounded-full bg-yellow-500" />
                      <span className="text-xs">😐</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3%</div>
                    <p className="text-xs text-muted-foreground">-1.5% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Negative Sentiment</CardTitle>
                    <div className="flex items-center gap-1">
                      <div className="h-4 w-4 rounded-full bg-red-500" />
                      <span className="text-xs">😠</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">9%</div>
                    <p className="text-xs text-muted-foreground">-0.8% from last month</p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <CardTitle>Sentiment Trend</CardTitle>
                    <CardDescription>Sentiment analysis over the past 6 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      {/* This would be a chart in a real app */}
                      <div className="flex h-full flex-col justify-between">
                        {sentimentTrend.map((month, i) => (
                          <div key={i} className="flex items-center gap-2 py-2">
                            <div className="w-12 text-sm text-muted-foreground">{month.date}</div>
                            <div className="flex h-4 flex-1 overflow-hidden rounded-full">
                              <div className="bg-green-500" style={{ width: `${month.positive}%` }}></div>
                              <div className="bg-yellow-500" style={{ width: `${month.neutral}%` }}></div>
                              <div className="bg-red-500" style={{ width: `${month.negative}%` }}></div>
                            </div>
                            <div className="text-sm text-muted-foreground">{month.positive}%</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-center gap-4">
                        <div className="flex items-center gap-1">
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          <span className="text-sm">Positive 😄</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                          <span className="text-sm">Neutral 😐</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-3 w-3 rounded-full bg-red-500"></div>
                          <span className="text-sm">Negative 😠</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Top Keywords</CardTitle>
                    <CardDescription>Most mentioned terms in customer feedback</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="font-medium">Product Quality</div>
                          <div className="text-muted-foreground">78%</div>
                        </div>
                        <Progress value={78} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="font-medium">Customer Service</div>
                          <div className="text-muted-foreground">63%</div>
                        </div>
                        <Progress value={63} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="font-medium">Price</div>
                          <div className="text-muted-foreground">52%</div>
                        </div>
                        <Progress value={52} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="font-medium">Delivery</div>
                          <div className="text-muted-foreground">45%</div>
                        </div>
                        <Progress value={45} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="font-medium">User Experience</div>
                          <div className="text-muted-foreground">38%</div>
                        </div>
                        <Progress value={38} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="analysis" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Analyze New Feedback</CardTitle>
                  <CardDescription>Enter text to analyze sentiment or upload feedback files</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="source">Select Source</Label>
                    <Select value={source} onValueChange={setSource}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sources</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="reviews">Product Reviews</SelectItem>
                        <SelectItem value="surveys">Customer Surveys</SelectItem>
                        <SelectItem value="support">Support Tickets</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feedback">Feedback Text</Label>
                    <Textarea
                      id="feedback"
                      placeholder="Enter customer feedback to analyze..."
                      className="min-h-[100px]"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button onClick={handleAnalyze} disabled={isAnalyzing || !inputText.trim()}>
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        "Analyze Sentiment"
                      )}
                    </Button>
                    <Button variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload File
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {analysisResult && (
                <Card>
                  <CardHeader>
                    <CardTitle>Analysis Results</CardTitle>
                    <CardDescription>Sentiment breakdown of the provided feedback</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="flex flex-1 flex-col items-center justify-center p-6 border rounded-lg">
                        <div className="text-center mb-4">
                          <h3 className="text-lg font-semibold">Sentiment Distribution</h3>
                        </div>
                        <div className="w-full max-w-[200px] aspect-square relative rounded-full border-8 border-background flex items-center justify-center overflow-hidden">
                          <div
                            className="absolute inset-0 bg-green-500"
                            style={{ clipPath: `polygon(50% 50%, 0 0, ${analysisResult.positive * 3.6}deg 0)` }}
                          ></div>
                          <div
                            className="absolute inset-0 bg-yellow-500"
                            style={{
                              clipPath: `polygon(50% 50%, ${analysisResult.positive * 3.6}deg 0, ${(analysisResult.positive + analysisResult.neutral) * 3.6}deg 0)`,
                            }}
                          ></div>
                          <div
                            className="absolute inset-0 bg-red-500"
                            style={{
                              clipPath: `polygon(50% 50%, ${(analysisResult.positive + analysisResult.neutral) * 3.6}deg 0, 360deg 0)`,
                            }}
                          ></div>
                          <div className="relative z-10 bg-background rounded-full w-2/3 h-2/3 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-4xl">{analysisResult.emoji}</div>
                              <div className="text-xl font-bold mt-1">{analysisResult.positive}%</div>
                              <div className="text-xs text-muted-foreground">{analysisResult.sentiment_text}</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-center gap-4 mt-4">
                          <div className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                            <span className="text-sm">{analysisResult.positive}% 😄</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                            <span className="text-sm">{analysisResult.neutral}% 😐</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                            <span className="text-sm">{analysisResult.negative}% 😠</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Key Insights</h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={analysisResult.positive > 60 ? "secondary" : "default"}
                                className={`flex items-center gap-1 ${getSentimentColorClass(analysisResult.positive, analysisResult.negative)}`}
                              >
                                {getSentimentIcon(analysisResult.positive, analysisResult.negative)}
                                <span>{analysisResult.sentiment_text}</span>
                                <span className="ml-1">{analysisResult.emoji}</span>
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge>Keywords</Badge>
                              <div className="flex flex-wrap gap-1">
                                {analysisResult.keywords.map((keyword: string, i: number) => (
                                  <span key={i} className="text-sm bg-muted px-2 py-1 rounded-full">
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge>Sources</Badge>
                              <div className="flex flex-wrap gap-1">
                                {analysisResult.sources.map((source: string, i: number) => (
                                  <span key={i} className="text-sm bg-muted px-2 py-1 rounded-full">
                                    {source}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <Alert>
                          <TrendingUp className="h-4 w-4" />
                          <AlertTitle className="flex items-center gap-2">
                            Sentiment: {analysisResult.sentiment_text} {analysisResult.emoji}
                          </AlertTitle>
                          <AlertDescription>
                            {analysisResult.summary || (
                              analysisResult.positive > 60
                                ? "Maintain current product quality and service levels. Consider highlighting positive feedback in marketing."
                                : analysisResult.negative > 30
                                  ? "Address negative feedback points immediately. Consider customer outreach program."
                                  : "Monitor sentiment trends closely. Focus on improving specific areas mentioned in feedback."
                            )}
                          </AlertDescription>
                        </Alert>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="trends" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sentiment Trends Over Time</CardTitle>
                  <CardDescription>Track how customer sentiment has evolved</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    {/* This would be a line chart in a real app */}
                    <div className="flex h-full flex-col justify-between">
                      {sentimentTrend.map((month, i) => (
                        <div key={i} className="flex items-center gap-2 py-3">
                          <div className="w-12 text-sm text-muted-foreground">{month.date}</div>
                          <div className="flex h-6 flex-1 overflow-hidden rounded-full">
                            <div className="bg-green-500" style={{ width: `${month.positive}%` }}></div>
                            <div className="bg-yellow-500" style={{ width: `${month.neutral}%` }}></div>
                            <div className="bg-red-500" style={{ width: `${month.negative}%` }}></div>
                          </div>
                          <div className="flex gap-2 text-sm">
                            <span className="text-green-500 flex items-center">{month.positive}% 😄</span>
                            <span className="text-yellow-500 flex items-center">{month.neutral}% 😐</span>
                            <span className="text-red-500 flex items-center">{month.negative}% 😠</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Topic Trends</CardTitle>
                    <CardDescription>Most discussed topics over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="font-medium">Product Features</div>
                          <div className="text-muted-foreground flex items-center gap-1">+12% <span className="text-green-500">😄</span></div>
                        </div>
                        <Progress value={72} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="font-medium">User Interface</div>
                          <div className="text-muted-foreground flex items-center gap-1">+8% <span className="text-green-500">🙂</span></div>
                        </div>
                        <Progress value={58} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="font-medium">Customer Support</div>
                          <div className="text-muted-foreground flex items-center gap-1">-3% <span className="text-red-500">😕</span></div>
                        </div>
                        <Progress value={45} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="font-medium">Pricing</div>
                          <div className="text-muted-foreground flex items-center gap-1">+5% <span className="text-green-500">😊</span></div>
                        </div>
                        <Progress value={38} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Sentiment by Product</CardTitle>
                    <CardDescription>How different products are performing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">Product A</div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          <span className="text-sm">82% 😄</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="font-medium">Product B</div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          <span className="text-sm">75% 🙂</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="font-medium">Product C</div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                          <span className="text-sm">58% 😐</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="font-medium">Product D</div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-red-500"></div>
                          <span className="text-sm">42% 😕</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="sources" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Social Media</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">75,682</div>
                    <p className="text-xs text-muted-foreground">43.8% of total feedback</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Product Reviews</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3,150</div>
                    <p className="text-xs text-muted-foreground">30.3% of total feedback</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Customer Surveys</CardTitle>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">452</div>
                    <p className="text-xs text-muted-foreground">15.8% of total feedback</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">288</div>
                    <p className="text-xs text-muted-foreground">10.1% of total feedback</p>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Feedback by Source</CardTitle>
                  <CardDescription>Sentiment distribution across different feedback channels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="font-medium">Social Media</div>
                        <div className="text-muted-foreground">1,248 mentions</div>
                      </div>
                      <div className="flex h-4 w-full overflow-hidden rounded-full">
                        <div className="bg-green-500 w-[65%]"></div>
                        <div className="bg-yellow-500 w-[20%]"></div>
                        <div className="bg-red-500 w-[15%]"></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">65% Positive <span className="text-green-500">😄</span></div>
                        <div className="flex items-center gap-1">20% Neutral <span>😐</span></div>
                        <div className="flex items-center gap-1">15% Negative <span className="text-red-500">😠</span></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="font-medium">Product Reviews</div>
                        <div className="text-muted-foreground">865 reviews</div>
                      </div>
                      <div className="flex h-4 w-full overflow-hidden rounded-full">
                        <div className="bg-green-500 w-[72%]"></div>
                        <div className="bg-yellow-500 w-[18%]"></div>
                        <div className="bg-red-500 w-[10%]"></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">72% Positive <span className="text-green-500">😄</span></div>
                        <div className="flex items-center gap-1">18% Neutral <span>😐</span></div>
                        <div className="flex items-center gap-1">10% Negative <span className="text-red-500">😠</span></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="font-medium">Customer Surveys</div>
                        <div className="text-muted-foreground">452 responses</div>
                      </div>
                      <div className="flex h-4 w-full overflow-hidden rounded-full">
                        <div className="bg-green-500 w-[68%]"></div>
                        <div className="bg-yellow-500 w-[22%]"></div>
                        <div className="bg-red-500 w-[10%]"></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">68% Positive <span className="text-green-500">🙂</span></div>
                        <div className="flex items-center gap-1">22% Neutral <span>😐</span></div>
                        <div className="flex items-center gap-1">10% Negative <span className="text-red-500">😕</span></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="font-medium">Support Tickets</div>
                        <div className="text-muted-foreground">288 tickets</div>
                      </div>
                      <div className="flex h-4 w-full overflow-hidden rounded-full">
                        <div className="bg-green-500 w-[45%]"></div>
                        <div className="bg-yellow-500 w-[30%]"></div>
                        <div className="bg-red-500 w-[25%]"></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">45% Positive <span className="text-green-500">😊</span></div>
                        <div className="flex items-center gap-1">30% Neutral <span>😐</span></div>
                        <div className="flex items-center gap-1">25% Negative <span className="text-red-500">😠</span></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}