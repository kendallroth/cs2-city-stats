using Game;
using Game.Buildings;
using Game.Citizens;
using Game.Common;
using Game.Tools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Unity.Collections;
using Unity.Entities;

namespace CityStats.Systems {
    internal partial class HomelessCalculatorSystem : GameSystemBase {
        private EntityQuery homelessQuery;


        #region Lifecycle
        protected override void OnCreate() {
            base.OnCreate();

            Mod.Log.Debug($"[{nameof(HomelessCalculatorSystem)}] OnCreate");

            homelessQuery = GetEntityQuery(
                ComponentType.ReadOnly<Household>(),
                ComponentType.ReadOnly<HouseholdCitizen>(),

                ComponentType.Exclude<CommuterHousehold>(),
                ComponentType.Exclude<TouristHousehold>(),
                ComponentType.Exclude<PropertyRenter>(),

                // Exclude deleted or temporary
                ComponentType.Exclude<Deleted>(),
                ComponentType.Exclude<Temp>()
            );

            // TODO: Verify documentation
            // Lets the system only run if there is at least one match to our query
            RequireForUpdate(homelessQuery);
        }


        protected override void OnUpdate() {
            Mod.Log.Debug($"{nameof(HomelessCalculatorSystem)} OnUpdate");
            NativeArray<HomelessHousehold> entities = homelessQuery.ToComponentDataArray<HomelessHousehold>(Allocator.Temp);

            Mod.Log.Debug($"{nameof(HomelessCalculatorSystem)} {entities.Length} homeless household");
        }


        public override int GetUpdateInterval(SystemUpdatePhase phase) {
            // Run every 5 minutes (1 day * 24 hours * 5 min == 120; closest power-of-2 is 128)
            int updatesPerDay = 128;
            return 262144 / updatesPerDay;
        }
        #endregion
    }
}
