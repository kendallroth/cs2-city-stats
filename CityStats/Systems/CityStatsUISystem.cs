using Game.Input;
using Game.UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CityStats.Systems {
    internal partial class CityStatsUISystem : UISystemBase {
        private static ProxyAction togglePanelBindingAction;

        protected override void OnCreate() {
            base.OnCreate();

            togglePanelBindingAction = Mod.Settings.GetAction(nameof(CityStatsSettings.TogglePanelBinding));
            // TODO: Wherever this moves should continue enabling the keybinding at startup (and not disabling it)
            togglePanelBindingAction.shouldBeEnabled = true;
            togglePanelBindingAction.onInteraction += (_, phase) => Mod.Log.Info($"[{togglePanelBindingAction.name}] On{phase} {togglePanelBindingAction.ReadValue<float>()}");
            // phases: Performed, Started, Cancelled, Waiting, Disabled
        }


        protected override void OnUpdate() {
            if (togglePanelBindingAction.WasPerformedThisFrame()) {
                Mod.Log.Info($"[{togglePanelBindingAction.name}] toggled {togglePanelBindingAction.ReadValue<float>()}");
                // TODO
            }

            base.OnUpdate();
        }
    }
}
