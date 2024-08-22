using Game;
using Game.Buildings;
using Game.Citizens;
using Game.Common;
using Game.Creatures;
using Game.Objects;
using Game.Tools;
using Game.UI;
using Game.UI.InGame;
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

        // DEBUG
        private EntityQuery criminalQuery;
        private EntityQuery homelessQuery_Human;
        private EntityQuery homelessQuery_Household;


        #region Lifecycle
        protected override void OnCreate() {
            base.OnCreate();

            Mod.Log.Debug($"[{nameof(HomelessCalculatorSystem)}] OnCreate");

            // Homeless Person
            //   Components:
            //      - Game.Creatures.Human [m_Flags=Homeless]
            //      - Game.Creatures.Resident [m_Flags=Arrive,Hangaround,IgnoreBenches]
            //        - m_Citizen: Entity(78485:1 - Citizen Male)
            //          - Components:
            //            - Game.Citizens.CurrentBuilding (park, not helpful)
            //            - Game.Citizens.CurrentBuilding (self, not helpful)
            //            - Game.Citizens.HouseholdMember (single household)
            //              - m_Household: Entity(95261:1 - Single Household)
            //                - Components:
            //                  - Game.Prefabs.PrefabRef - DynamicHousehold
            //                    - Game.Prefabs.HouseholdData
            //                      - m_ChildCount
            //                      - m_AdultCount
            //                      - m_ElderCount
            //                      - m_StudentCount
            //                  - Game.Citizens.HomelessHousehold
            //                    - m_TempHome (park entity)
            //                  - Game.Citizens.Household [m_Flags=MovedIn
            //            - Game.Citizens.Citizen
            //              - m_UnemploymentCounter: 0 (not helpful?)
            //            - Game.Citizens.Arrived (tag)
            //       - Game.Prefabs.PrefabRef - Elderly_Male
            //         - Game.Prefabs.ResidentData
            //           - m_Age: Elderly

            // Returns a relatively accurate number (couple hundred off)
            criminalQuery = GetEntityQuery(
                ComponentType.ReadOnly<Citizen>(),
                ComponentType.ReadOnly<Criminal>(),
                ComponentType.Exclude<Deleted>(),
                ComponentType.Exclude<Temp>()
            );

            // Returns the correct number
            homelessQuery_Household = GetEntityQuery(
                ComponentType.ReadOnly<HomelessHousehold>()
            );
            // Should be 53 currently
            // Homeless households have a buffer of members: 'Game.Citizens.HouseholdCitizen'
            //   Members may have 'Worker' or 'Student' component
            //   Members have a 'Game.Citizens.Citizen' component, with 'm_BirthDate' int (6, etc

            // Currently 2332 criminals
            // Game.UI.InGame.PoliceInfoviewUISystem
            // Criminal query: m_CriminalQuery = GetEntityQuery(ComponentType.ReadOnly<Citizen>(), ComponentType.ReadOnly<Criminal>(), ComponentType.Exclude<Deleted>(), ComponentType.Exclude<Temp>());

            // CitizenUIUtils class has some important information (particularly 'GetOccupation')

            // Criminals have a Game.Citizens.Criminal component [mFlags=Robber]

            // Returns too low a number (by several thousand)
            homelessQuery_Human = GetEntityQuery(
                ComponentType.ReadOnly<Human>()
            );

            // Returns a ridiculously high number (hundreds of thousands)
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

            // DEBUG
            RequireForUpdate(criminalQuery);
            RequireForUpdate(homelessQuery_Human);
            RequireForUpdate(homelessQuery_Household);
        }

        // ...to get citizen name...
        // NameSystem.GetCitizenName()


        protected override void OnUpdate() {
            Mod.Log.Debug($"{nameof(HomelessCalculatorSystem)} OnUpdate");
            NativeArray<HomelessHousehold> entities = homelessQuery.ToComponentDataArray<HomelessHousehold>(Allocator.Temp);

            var entities_household_count = homelessQuery_Household.CalculateEntityCount();
            var entities_household_entities = homelessQuery_Household.ToEntityArray(Allocator.Temp);
            NativeArray<HomelessHousehold> entities_household = homelessQuery_Household.ToComponentDataArray<HomelessHousehold>(Allocator.Temp);
            NativeArray<Human> entities_human = homelessQuery_Human.ToComponentDataArray<Human>(Allocator.Temp);
            NativeArray<Criminal> entities_criminal = criminalQuery.ToComponentDataArray<Criminal>(Allocator.Temp);

            Mod.Log.Debug($"{nameof(HomelessCalculatorSystem)} {entities.Length} homeless household");
            Mod.Log.Debug($"{nameof(HomelessCalculatorSystem)} {entities_household.Length} homeless household (2)");
            Mod.Log.Debug($"{nameof(HomelessCalculatorSystem)} {entities_household_count} homeless household count");
            Mod.Log.Debug($"{nameof(HomelessCalculatorSystem)} {entities_human.Length} human");
            Mod.Log.Debug($"{nameof(HomelessCalculatorSystem)} {entities_criminal.Length} criminal");
        }


        public override int GetUpdateInterval(SystemUpdatePhase phase) {
            // Run every 5 minutes (1 day * 24 hours * 5 min == 120; closest power-of-2 is 128)
            int updatesPerDay = 128;
            return 262144 / updatesPerDay;
        }
        #endregion
    }
}
