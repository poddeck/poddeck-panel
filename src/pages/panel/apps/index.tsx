import PanelPage from "@/layouts/panel"
import {useEffect, useMemo, useState} from "react"
import appService, {type App} from "@/api/services/app-service.ts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Badge} from '@/components/ui/badge'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Checkbox} from '@/components/ui/checkbox'
import {ScrollArea} from '@/components/ui/scroll-area'
import {Separator} from '@/components/ui/separator'
import {Skeleton} from '@/components/ui/skeleton'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem
} from '@/components/ui/pagination'
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Funnel,
  Package,
  Search
} from 'lucide-react'
import {usePagination} from '@/hooks/use-pagination'

export default function AppsPage() {
  const [apps, setApps] = useState<App[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(9)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRepositories, setSelectedRepositories] = useState<string[]>([])
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [showInstalledOnly, setShowInstalledOnly] = useState(false)

  useEffect(() => {
    async function loadApps() {
      try {
        const response = await appService.list()
        if (response.success != false) {
          setApps(response.apps)
        }
      } finally {
        setIsLoading(false)
      }
    }
    loadApps()
  }, [])

  const { repositories, keywords } = useMemo(() => {
    const repoSet = new Set<string>()
    const keywordSet = new Set<string>()

    apps.forEach(app => {
      repoSet.add(app.repository)
      app.keywords.forEach(kw => keywordSet.add(kw))
    })

    return {
      repositories: Array.from(repoSet).sort(),
      keywords: Array.from(keywordSet).sort()
    }
  }, [apps])

  const { filteredApps, totalPages } = useMemo(() => {
    let filtered = apps.filter(app => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          app.name.toLowerCase().includes(query) ||
          app.description.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      if (selectedRepositories.length > 0) {
        if (!selectedRepositories.includes(app.repository)) return false
      }

      if (selectedKeywords.length > 0) {
        const hasKeyword = selectedKeywords.some(kw => app.keywords.includes(kw))
        if (!hasKeyword) return false
      }

      if (showInstalledOnly && !app.installed) return false

      return true
    })

    const total = Math.ceil(filtered.length / itemsPerPage)

    return {
      filteredApps: filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
      totalPages: total
    }
  }, [apps, searchQuery, selectedRepositories, selectedKeywords, showInstalledOnly, currentPage, itemsPerPage])

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    totalPages,
    paginationItemsToDisplay: 5
  })

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedRepositories, selectedKeywords, showInstalledOnly, itemsPerPage])

  const toggleRepository = (repo: string) => {
    setSelectedRepositories(prev =>
      prev.includes(repo)
        ? prev.filter(r => r !== repo)
        : [...prev, repo]
    )
  }

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords(prev =>
      prev.includes(keyword)
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    )
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedRepositories([])
    setSelectedKeywords([])
    setShowInstalledOnly(false)
  }

  const AppCardSkeleton = () => (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Skeleton className="h-[50px] w-[50px] rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <div className="flex gap-1">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <Skeleton className="h-4 w-4/6" />
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-9 w-28" />
      </CardFooter>
    </Card>
  )

  const FilterSkeleton = () => (
    <Card className="h-full">
      <CardHeader>
        <Skeleton className="h-6 w-24" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Separator />
        <div className="space-y-2 h-32">
          <Skeleton className="h-4 w-32" />
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-5 w-8" />
              </div>
            ))}
          </div>
        </div>
        <Separator />
        <div className="space-y-2 h-64">
          <Skeleton className="h-4 w-32" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <PanelPage title="panel.page.apps.title" layout={false}>
      <div className="w-[min(1800px,95%)] mx-auto flex flex-col flex-1 mt-[4vh]">
        <div className="flex flex-1 gap-6 p-4 pt-0">
          <aside className="w-64 flex-shrink-0">
            {isLoading ? (
              <FilterSkeleton />
            ) : (
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Funnel size={20}/> Filter
                    </CardTitle>
                    {(searchQuery || selectedRepositories.length > 0 || selectedKeywords.length > 0 || showInstalledOnly) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7"
                        onClick={clearFilters}
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="search">Suche</Label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Chart suchen..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Repository ({repositories.length})
                    </Label>
                    <ScrollArea className="h-32">
                      <div className="space-y-2">
                        {repositories.map(repo => {
                          const count = apps.filter(app => app.repository === repo).length
                          return (
                            <div key={repo} className="flex items-center justify-between space-x-2">
                              <div className="flex items-center space-x-2 flex-1 min-w-0">
                                <Checkbox
                                  id={`repo-${repo}`}
                                  checked={selectedRepositories.includes(repo)}
                                  onCheckedChange={() => toggleRepository(repo)}
                                />
                                <Label
                                  htmlFor={`repo-${repo}`}
                                  className="text-sm font-normal cursor-pointer truncate"
                                  title={repo}
                                >
                                  {repo}
                                </Label>
                              </div>
                              <Badge variant="secondary" className="text-xs flex-shrink-0">
                                {count}
                              </Badge>
                            </div>
                          )
                        })}
                      </div>
                    </ScrollArea>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Keywords ({keywords.length})
                    </Label>
                    <ScrollArea className="h-64">
                      <div className="space-y-2">
                        {keywords.map(keyword => (
                          <div key={keyword} className="flex items-center space-x-2">
                            <Checkbox
                              id={`kw-${keyword}`}
                              checked={selectedKeywords.includes(keyword)}
                              onCheckedChange={() => toggleKeyword(keyword)}
                            />
                            <Label
                              htmlFor={`kw-${keyword}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {keyword}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  <Separator />

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="installed"
                      checked={showInstalledOnly}
                      onCheckedChange={(checked) => setShowInstalledOnly(checked as boolean)}
                    />
                    <Label
                      htmlFor="installed"
                      className="text-sm font-normal cursor-pointer"
                    >
                      Nur installierte anzeigen
                    </Label>
                  </div>

                  <div className="mt-15 text-center">
                    <span className="text-sm text-muted-foreground">
                      Powered by Helm
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </aside>

          <main className="flex-1 space-y-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: itemsPerPage }).map((_, i) => (
                  <AppCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredApps.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-2">
                <Package className="h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">Keine Charts gefunden</p>
                <Button variant="link" onClick={clearFilters}>
                  Filter zurücksetzen
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredApps.map(app => (
                    <Card key={`${app.repository}-${app.name}`} className="flex flex-col">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <Package size={50}/>
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <CardTitle className="text-base line-clamp-1">
                                <span className="text-muted-foreground">
                                  {app.repository}
                                </span>
                                <span className="text-muted-foreground px-2">/</span>
                                {app.name}
                              </CardTitle>
                              {app.installed && (
                                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                              )}
                            </div>
                            <CardDescription className="flex flex-wrap gap-1 pt-1">
                              {app.keywords.slice(0, 3).map(kw => (
                                <Badge key={kw} variant="outline" className="text-xs">
                                  {kw}
                                </Badge>
                              ))}
                              {app.keywords.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{app.keywords.length - 3}
                                </Badge>
                              )}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {app.description}
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">
                            Version
                          </span>
                          <span className="text-sm">
                            {app.versions[0]?.chart_version || 'N/A'}
                          </span>
                        </div>
                        <Button size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          {app.installed ? 'Verwalten' : 'Installieren'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between max-sm:flex-col gap-3 pt-4">
                    <Pagination className="relative z-10">
                      <PaginationContent>
                        <PaginationItem>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                        </PaginationItem>

                        {showLeftEllipsis && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}

                        {pages.map((page: number) => {
                          const active = page === currentPage
                          return (
                            <PaginationItem key={page}>
                              <Button
                                size="icon"
                                variant={active ? 'outline' : 'ghost'}
                                onClick={() => setCurrentPage(page)}
                              >
                                {page}
                              </Button>
                            </PaginationItem>
                          )
                        })}

                        {showRightEllipsis && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}

                        <PaginationItem>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </PanelPage>
  )
}