const refrigeratorClasses = require('../model/refrigeratorClasses.json');

/*
 * groupBy String [optional], required if style = 'bar'
 *   either the name of a column in the database or one provided by
 *   computedColumns.js
 * colorBy String [optional], required if style = 'pie'
 *   either the name of a column in the database or one provided by
 *   computedColumns.js
 * repeatBy String [optional], either the name of a column in the database or
 *   one provided by computedColumns.js
 * sort 'ASC'|'DESC' [optional], ascending or descending
 * style 'pie'|'bar'|'map' | 'heatmap', choose a chart type; `map` will automatically send
 *     location_latitude and location_longitude
 * mapType String [optional] is only
 *     supported for `style: 'map'`. 'maintenance_priority' is the only
 *     supported value so far.
 * facilityPopup Object [optional] should be used iff style is map
 *     can map a database column to one of the following:
 *          'COUNT': counts the number of nonempty values for that column
 *          'SUM': sums the values of that column (note: column values must be able to be cast to an int)
 *          'BY_FACILITY': for columns that are in health_facilities2_odkx, i.e. an attribute specific to
 *               each facility. Examples include 'facility_level' and 'ownership'. These will be included
 *               with the other aggregated data.
 * type String, either 'refrigerator' or 'facility'. Refrigerator visualizations will count refrigerators
 *     (refrigerator maps will still aggregate them by facility). Facility visualizations will
 *     1. Count facilities instead of CCE (in bar/pie charts)
 *     2. Include facilities without any CCE
 *     3. Disable the filter options that use the refrigerators or refrigerator_types tables
 * regionLevel 'District (Level 3)' | 'Region (Level 2)' should be used iff style is 'heatmap'
 *     determines the level of shading for the heatmap
 * fill_specs Object [optional] can be used if style is 'heatmap'
 *     min_opacity: double, 0-1 - minimum opacity of fill color
 *     max_opacity: double, 0-1 - maximum opacity of fill color
 *     fill_color: string - color to fill heatmap areas with,
 *     fill_outline_color: string - color to outline filled areas with
 * columns Array of Strings Required when using `style: 'list'`. Takes a list of column names to display
 *     in the table. NOTE: table names must match the database exactly (Postgres makes all column names
 *     lowercase).
 * disableLegend boolean [optional], determines whether to hide the legend
 * legendNonzeroOnly boolean [optional], hides legend options that are 0
 * legendOrder Array [optional], list to specify order of legend items. Items not included will
 *      be appended to the end with arbitrary order.
 */
module.exports = {
    // CCEM table 3.3
    'Working status by CCE model': {
        type: 'refrigerator',
        groupBy: 'model_id',
        colorBy: 'functional_status',
        colorMap: {
            'functioning': 'blue',
            'not_functioning': 'red',
            'Missing data': 'gray'
        },
        style: 'bar'
    },
    // Richard says this is also a CCEM chart
    'Age by CCE model': {
        type: 'refrigerator',
        groupBy: 'model_id',
        colorBy: 'AgeGroups',
        colorMap: {
            '0-5 Years': 'green',
            '6-10 Years': 'yellow',
            '>10 Years': 'red',
            'Missing data': 'gray'
        },
        style: 'bar',
        legendOrder: ['0-5 Years', '6-10 Years', '>10 Years', 'Missing data']
    },
    // CCEM chart 3.4
    'CCE by working status': {
        type: 'refrigerator',
        groupBy: 'functional_status',
        colorBy: 'functional_status',
        colorMap: {
            'functioning': 'blue',
            'not_functioning': 'red',
            'Missing data': 'gray'
        },
        style: 'bar'
    },
    // CCEM chart 3.4
    'CCE by working status (pie)': {
        type: 'refrigerator',
        colorBy: 'functional_status',
        colorMap: {
            'functioning': 'blue',
            'not_functioning': 'red',
            'Missing data': 'gray'
        },
        style: 'pie'
    },
    // CCEM table 3.6b
    'CCE utilization': {
        type: 'refrigerator',
        groupBy: 'model_id',
        colorBy: 'utilization',
        sort: 'DESC',
        colorMap: {
            'Missing data': 'gray'
        },
        style: 'bar'
    },
    // CCEM table 1.8
    'Electricity availability': {
        type: 'refrigerator',
        groupBy: 'grid_power_availability',
        colorBy: 'grid_power_availability',
        colorMap: {
            'more_than_16': 'green',
            '8_to_16': 'yellow',
            '4_to_8': 'orange',
            'fewer_than_4': 'red',
            'none': 'brown',
            'Missing data': 'gray'
        },
        legendOrder: [
            'none',
            'fewer_than_4',
            '4_to_8',
            '8_to_16',
            'more_than_16',
            'Missing data'
        ],
        style: 'bar'
    },
    // CCEM table 1.8
    'Electricity availability (pie)': {
        type: 'refrigerator',
        colorBy: 'grid_power_availability',
        colorMap: {
            'more_than_16': 'green',
            '8_to_16': 'yellow',
            '4_to_8': 'orange',
            'fewer_than_4': 'red',
            'none': 'brown',
            'Missing data': 'gray'
        },
        legendOrder: [
            'none',
            'fewer_than_4',
            '4_to_8',
            '8_to_16',
            'more_than_16',
            'Missing data'
        ],
        style: 'pie'
    },
    // CCEM table 3.5a
    'CCE models by age group': {
        type: 'refrigerator',
        groupBy: 'AgeGroups',
        colorBy: 'AgeGroups',
        sort: 'DESC',
        colorMap: {
            '0-5 Years': 'green',
            '6-10 Years': 'yellow',
            '>10 Years': 'red',
            'Missing data': 'gray'
        },
        style: 'bar'
    },
    // CCEM table 3.5a
    'CCE models by age group (pie)': {
        type: 'refrigerator',
        colorBy: 'AgeGroups',
        sort: 'DESC',
        colorMap: {
            '0-5 Years': 'green',
            '6-10 Years': 'yellow',
            '>10 Years': 'red',
            'Missing data': 'gray'
        },
        style: 'pie',
        legendOrder: ['0-5 Years', '6-10 Years', '>10 Years', 'Missing data']
    },
    // Maintenance priority map
    'Maintenance priority by facility': {
        type: 'refrigerator',
        mapType: 'maintenance_priority',
        style: 'map',
        facilityPopup: {
            'maintenance_priority': [ 'high', 'low', 'medium', 'not_applicable' ]
        }
    },
    // count of refrigerators for each classification
    // Note: Uses view in database, which will need to be updated if new ref types are added
    'CCE by type (pie)': {
        type: 'refrigerator',
        colorBy: 'refrigerator_class',
        colorMap: {
            'ILR': 'blue',
            'Absorption': 'red',
            'Freezer': 'green',
            'Solar': 'yellow',
            'Other': 'purple',
            'No group': 'gray'
        },
        style: 'pie'
    },
    'CCE model (bar)': {
        type: 'refrigerator',
        groupBy: 'model_id',
        colorBy: 'model_id',
        style: 'bar'
    },
    'CCE utilization (bar)': {
        type: 'refrigerator',
        groupBy: 'utilization',
        colorBy: 'utilization',
        colorMap: {
            'Missing data': 'gray'
        },
        style: 'bar'
    },
    'CCE maintenance priority (bar)': {
        type: 'refrigerator',
        groupBy: 'maintenance_priority',
        colorBy: 'maintenance_priority',
        colorMap: {
            'not_applicable': 'blue',
            'low': 'yellow',
            'medium': 'orange',
            'high': 'red',
            'Missing data': 'gray'
        },
        style: 'bar'
    },
    'Maintence priority by model': {
        type: 'refrigerator',
        groupBy: 'model_id',
        colorBy: 'maintenance_priority',
        colorMap: {
            'not_applicable': 'blue',
            'low': 'yellow',
            'medium': 'orange',
            'high': 'red',
            'Missing data': 'gray'
        },
        style: 'bar'
    },
    'CCE facility power availability by model': {
        type: 'refrigerator',
        groupBy: 'model_id',
        colorBy: 'grid_power_availability',
        colorMap: {
            'more_than_16': 'green',
            '8_to_16': 'yellow',
            '4_to_8': 'orange',
            'fewer_than_4': 'red',
            'none': 'brown',
            'Missing data': 'gray'
        },
        legendOrder: [
            'none',
            'fewer_than_4',
            '4_to_8',
            '8_to_16',
            'more_than_16',
            'Missing data'
        ],
        style: 'bar'
    },
    'CCE model by facility power availability': {
        type: 'refrigerator',
        groupBy: 'grid_power_availability',
        colorBy: 'model_id',
        style: 'bar',
        legendNonzeroOnly: true
    },
    'CCE model by facility type': {
        type: 'refrigerator',
        groupBy: 'facility_level',
        colorBy: 'model_id',
        style: 'bar',
        legendNonzeroOnly: true
    },
    'Facility type by CCE model': {
        type: 'refrigerator',
        groupBy: 'model_id',
        colorBy: 'facility_level',
        colorMap: {
            'Missing data': 'gray'
        },
        style: 'bar',
        legendNonzeroOnly: true
    },
    // Facility details map
    'Facility details map': {
        type: 'facility',
        mapType: 'facility_details',
        style: 'map',
        facilityPopup: {
            'refrigerator_class': Object.keys(refrigeratorClasses),
            'facility_level': 'BY_FACILITY',
            'ownership': 'BY_FACILITY'
        }
    },
    'Recent alarms map': {
        type: 'refrigerator',
        mapType: 'alarm_counts',
        style: 'map',
        facilityPopup: {
            'faulty_refrigerator_id': 'COUNT'
        }
    },
    'Catchment population': {
        type: 'facility', // with this we count facilities instead of refrigerators
        groupBy: 'catchment_pop_bucket',
        colorBy: 'catchment_pop_bucket',
        style: 'bar'
    },
    'Facility last update month': {
        type: 'facility',
        groupBy: 'updatemonth_facilities',
        colorBy: 'updatemonth_facilities',
        style: 'bar'
    },
    'Refrigerator last update month': {
        type: 'refrigerator',
        groupBy: 'updatemonth_refrigerators',
        colorBy: 'updatemonth_refrigerators',
        style: 'bar'
    },
    'Facility updates by user': {
        type: 'facility',
        groupBy: 'lastupdateuser_health_facilities',
        colorBy: 'lastupdateuser_health_facilities',
        style: 'bar'
    },
    'Refrigerator updates by user': {
        type: 'refrigerator',
        groupBy: 'lastupdateuser_refrigerators',
        colorBy: 'lastupdateuser_refrigerators',
        style: 'bar'
    },
    'Percentage of facilities with power source: grid (district)': {
        type: 'facility',
        style: 'heatmap',
        colorBy: 'electricity_source_grid',
        regionLevel: 'District (Level 3)',
        fill_specs: {  // Example usage of fill specs using default specs
            min_opacity: 0.1,
            max_opacity: 0.95,
            fill_color: '#9D41AB',
            fill_outline_color: '#680D75'
        }
    },
    'Percentage of facilities with power source: grid (region)': {
        type: 'facility',
        style: 'heatmap',
        colorBy: 'electricity_source_grid',
        regionLevel: 'Region (Level 2)',
        fill_specs: {  // Example usage of fill specs using default specs
            min_opacity: 0.1,
            max_opacity: 0.95,
            fill_color: '#9D41AB',
            fill_outline_color: '#680D75'
        }
    },
    'Percentage of facilities with 4+ hours of grid power (district)': {
        type: 'facility',
        style: 'heatmap',
        colorBy: 'grid_power_at_least_4',
        regionLevel: 'District (Level 3)',
        fill_specs: {
            fill_color: '#59a14f'
        }
    },
    'Percentage of facilities with 4+ hours of grid power (region)': {
        type: 'facility',
        style: 'heatmap',
        colorBy: 'grid_power_at_least_4',
        regionLevel: 'Region (Level 2)',
        fill_specs: {
            fill_color: '#59a14f'
        }
    },
    'All facilities list': {
        type: 'facility',
        style: 'list',
        columns: [
            'facility_name',
            'facility_level',
            'regionlevel2',
            'regionlevel3',
            'electricity_source',
            'fuel_availability',
            'grid_power_availability',
            'ownership',
            'authority',
            'lastupdateuser_health_facilities',
            'contact_name',
            'contact_phone_number',
            'contact_title',
            'vaccine_supply_interval',
            'vaccine_supply_mode',
            'distance_to_supply',
            'immunization_services_offered'
        ]
    },
    'All CCE list': {
        type: 'refrigerator',
        style: 'list',
        columns: [
            'facility_name',
            'facility_level',
            'regionlevel2',
            'regionlevel3',
            'model_id',
            'year_installed',
            'power_source',
            'utilization',
            'functional_status',
            'maintenance_priority',
            'reason_not_working'
        ]
    },
    'Non-functional CCE list': {
        type: 'refrigerator',
        style: 'list',
        columns: [
            'facility_name',
            'regionlevel3',
            'model_id',
            'year_installed',
            'functional_status_filtered',
            'maintenance_priority_filtered',
            'reason_not_working'
        ]
    },
    'Refrigeration volume vs requirements map (demo)': {
        type: 'facility',
        mapType: 'colored_facilities',
        style: 'map',
        colorBy: 'refrigeration_volume_ratio',
        colorMap: {
            '>30% shortage': 'red',
            'Within 30% of estimate': 'yellow',
            '>30% above estimate': 'green'
        },
        facilityPopup: {
            'refrigeration_volume_ratio': 'BY_FACILITY',
            'refrigeration_volume': 'BY_FACILITY',
            'catchment_population': 'BY_FACILITY',
            'regionlevel2': 'BY_FACILITY',
            'regionlevel3': 'BY_FACILITY',
            'ownership': 'BY_FACILITY',
            'authority': 'BY_FACILITY'
        }
    },
    'Freezer volume vs requirements map (demo)': {
        type: 'facility',
        mapType: 'colored_facilities',
        style: 'map',
        colorBy: 'freezer_volume_ratio',
        colorMap: {
            '>30% shortage': 'red',
            'Within 30% of estimate': 'yellow',
            '>30% above estimate': 'green'
        },
        facilityPopup: {
            'freezer_volume_ratio': 'BY_FACILITY',
            'freezer_volume': 'BY_FACILITY',
            'catchment_population': 'BY_FACILITY',
            'regionlevel2': 'BY_FACILITY',
            'regionlevel3': 'BY_FACILITY',
            'ownership': 'BY_FACILITY',
            'authority': 'BY_FACILITY'
        }
    },
    'Facilities with volume shortage (demo)': {
        type: 'facility',
        style: 'list',
        columns: [
            'facility_name',
            'regionlevel3',
            'catchment_population',
            'refrigeration_volume_filtered',
            'freezer_volume_filtered',
            'ownership',
            'authority'
        ]
    },
    'Percentage of facilities updated within 3 months': {
        type: 'facility',
        style: 'heatmap',
        colorBy: 'updated_facilities',
        regionLevel: 'Region (Level 2)',
        fill_specs: {
            fill_color: '#59a14f'
        }
    },
    'Update status by facility': {
        type: 'facility',
        mapType: 'colored_facilities',
        style: 'map',
        colorBy: 'facility_update_status',
        colorMap: {
            'Never': 'red',
            'Stale': 'yellow',
            'Recent': 'green'
        },
        facilityPopup: {
            'facility_update_status': 'BY_FACILITY',
            'facility_savepoint': 'BY_FACILITY',
            'lastupdateuser_health_facilities': 'BY_FACILITY',
            'regionlevel2': 'BY_FACILITY',
            'regionlevel3': 'BY_FACILITY',
            'ownership': 'BY_FACILITY',
            'authority': 'BY_FACILITY'
        }
    }
};
