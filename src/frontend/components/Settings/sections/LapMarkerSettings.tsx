import { useState } from 'react';
import { BaseSettingsSection } from '../components/BaseSettingsSection';
import { LapMarkerWidgetSettings } from '../types';
import { useDashboard } from '@irdashies/context';
import { ToggleSwitch } from '../components/ToggleSwitch';

const SETTING_ID = 'lapMarker';

const defaultConfig: LapMarkerWidgetSettings['config'] = {
  background: { opacity: 0 },
  showOnlyWhenOnTrack: false,
};

export const LapMarkerSettings = () => {
  const { currentDashboard } = useDashboard();
  const savedSettings = currentDashboard?.widgets.find(w => w.id === SETTING_ID) as LapMarkerWidgetSettings | undefined;
  const [settings, setSettings] = useState<LapMarkerWidgetSettings>({
    enabled: savedSettings?.enabled ?? false,
    config: {
      ...defaultConfig,
      ...savedSettings?.config,
    },
  });

  if (!currentDashboard) {
    return <>Loading...</>;
  }

  return (
    <BaseSettingsSection
      title="Lap Marker Settings"
      description="Configure how the lap marker widget appears and behaves."
      settings={settings}
      onSettingsChange={setSettings}
      widgetId={SETTING_ID}
    >
      {(handleConfigChange) => (
        <div className="space-y-8">
          {/* Background Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-slate-200">
                Background
              </h3>
            </div>
            <div className="space-y-3 pl-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">
                  Background Opacity
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.config.background.opacity}
                    onChange={(e) =>
                      handleConfigChange({
                        background: { opacity: parseInt(e.target.value) },
                      })
                    }
                    className="w-20 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-slate-400 w-8">
                    {settings.config.background.opacity}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Show Only When On Track Settings */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-md font-medium text-slate-300">
                Show Only When On Track
              </h4>
              <p className="text-sm text-slate-400">
                If enabled, the lap marker will only be shown when you are driving.
              </p>
            </div>
            <ToggleSwitch
              enabled={settings.config.showOnlyWhenOnTrack ?? false}
              onToggle={(enabled) =>
                handleConfigChange({ showOnlyWhenOnTrack: enabled })
              }
            />
          </div>
        </div>
      )}
    </BaseSettingsSection>
  );
};
