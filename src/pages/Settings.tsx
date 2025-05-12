
import React from 'react';
import { NavBar } from '@/components/layout/NavBar';
import { MetaTags } from '@/components/MetaTags';
import { useLanguage } from '@/contexts/language';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { PreferenceLanguageSelect } from '@/components/settings/PreferenceLanguageSelect';

export default function Settings() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { settings, updateSetting, resetSettings } = useSettings();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title={t("nav.settings")} />
      <NavBar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-bold text-justice-light mb-8">{t("settings.title")}</h1>
        
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-justice-dark/50">
            <TabsTrigger value="general">{t("settings.general")}</TabsTrigger>
            <TabsTrigger value="notifications">{t("settings.notifications")}</TabsTrigger>
            <TabsTrigger value="appearance">{t("settings.appearance")}</TabsTrigger>
            <TabsTrigger value="advanced">{t("settings.advanced")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card className="bg-justice-dark/30 border-justice-primary/20">
              <CardHeader>
                <CardTitle>{t("settings.general")}</CardTitle>
                <CardDescription>{t("settings.generalDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="language">{t("settings.language")}</Label>
                    <PreferenceLanguageSelect />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-translate">{t("settings.autoTranslate")}</Label>
                    <Switch
                      id="auto-translate"
                      checked={settings.autoTranslate}
                      onCheckedChange={(checked) => updateSetting('autoTranslate', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card className="bg-justice-dark/30 border-justice-primary/20">
              <CardHeader>
                <CardTitle>{t("settings.notifications")}</CardTitle>
                <CardDescription>{t("settings.notificationsDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">{t("settings.enableNotifications")}</Label>
                    <Switch
                      id="notifications"
                      checked={settings.notifications}
                      onCheckedChange={(checked) => updateSetting('notifications', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance">
            <Card className="bg-justice-dark/30 border-justice-primary/20">
              <CardHeader>
                <CardTitle>{t("settings.appearance")}</CardTitle>
                <CardDescription>{t("settings.appearanceDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="high-contrast">{t("settings.highContrast")}</Label>
                    <Switch
                      id="high-contrast"
                      checked={settings.highContrastMode}
                      onCheckedChange={(checked) => updateSetting('highContrastMode', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced">
            <Card className="bg-justice-dark/30 border-justice-primary/20">
              <CardHeader>
                <CardTitle>{t("settings.advanced")}</CardTitle>
                <CardDescription>{t("settings.advancedDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="developer-mode">{t("settings.developerMode")}</Label>
                    <Switch
                      id="developer-mode"
                      checked={settings.developerMode}
                      onCheckedChange={(checked) => updateSetting('developerMode', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="audio-enabled">{t("settings.audioEnabled")}</Label>
                    <Switch
                      id="audio-enabled"
                      checked={settings.audioEnabled}
                      onCheckedChange={(checked) => updateSetting('audioEnabled', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
