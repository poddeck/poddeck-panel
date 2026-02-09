import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle, CheckCircle2, Search } from 'lucide-react'
import appService, { type App } from '@/api/services/app-service'

interface AppInstallDialogProps {
  app: App | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onInstallSuccess?: () => void
}

export function AppInstallDialog({
                                   app,
                                   open,
                                   onOpenChange,
                                   onInstallSuccess
                                 }: AppInstallDialogProps) {
  const [selectedVersion, setSelectedVersion] = useState('')
  const [namespace, setNamespace] = useState('default')
  const [isInstalling, setIsInstalling] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [versionSearch, setVersionSearch] = useState('')

  const handleInstall = async () => {
    if (!app || !selectedVersion) return

    setIsInstalling(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await appService.install({
        name: app.name,
        chart: `${app.repository}/${app.name}`,
        namespace: namespace,
        version: selectedVersion
      })

      if (response.success) {
        setSuccess(true)
        setTimeout(() => {
          onOpenChange(false)
          onInstallSuccess?.()
          resetForm()
        }, 1500)
      } else {
        setError(response.output || 'Installation fehlgeschlagen')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten')
    } finally {
      setIsInstalling(false)
    }
  }

  const resetForm = () => {
    setSelectedVersion('')
    setNamespace('default')
    setError(null)
    setSuccess(false)
    setVersionSearch('')
  }

  const handleOpenChange = (open: boolean) => {
    if (!open && !isInstalling) {
      resetForm()
    }
    onOpenChange(open)
  }

  if (!app) return null

  // Filter versions based on search
  const filteredVersions = app.versions.filter((version) => {
    const searchLower = versionSearch.toLowerCase()
    return (
      version.chart_version.toLowerCase().includes(searchLower) ||
      version.app_version?.toLowerCase().includes(searchLower)
    )
  })

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {app.name} installieren
          </DialogTitle>
          <DialogDescription>
            Wähle eine Version und einen Namespace für die Installation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="version">Version *</Label>
            <Select
              value={selectedVersion}
              onValueChange={setSelectedVersion}
              disabled={isInstalling || success}
            >
              <SelectTrigger id="version" className="w-full">
                <SelectValue placeholder="Version auswählen..." />
              </SelectTrigger>
              <SelectContent>
                <div className="sticky top-0 p-2 border-b">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Version suchen..."
                      value={versionSearch}
                      onChange={(e) => setVersionSearch(e.target.value)}
                      className="pl-8"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {filteredVersions.length > 0 ? (
                    filteredVersions.map((version) => (
                      <SelectItem
                        key={version.chart_version}
                        value={version.chart_version}
                      >
                        {version.chart_version}
                        {version.app_version && (
                          <span className="text-muted-foreground ml-2">
                            (App: {version.app_version})
                          </span>
                        )}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Keine Versionen gefunden
                    </div>
                  )}
                </div>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="namespace">Namespace *</Label>
            <Input
              id="namespace"
              value={namespace}
              onChange={(e) => setNamespace(e.target.value)}
              placeholder="default"
              disabled={isInstalling || success}
            />
            <p className="text-xs text-muted-foreground">
              Der Kubernetes Namespace, in dem die App installiert wird.
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-600 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>
                Installation erfolgreich gestartet!
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isInstalling}
          >
            Abbrechen
          </Button>
          <Button
            onClick={handleInstall}
            disabled={!selectedVersion || !namespace || isInstalling || success}
          >
            {isInstalling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isInstalling ? 'Installiere...' : 'Installieren'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}