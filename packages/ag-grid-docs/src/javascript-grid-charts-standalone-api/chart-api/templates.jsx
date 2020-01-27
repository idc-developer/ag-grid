import { formatJson, deepClone } from "./utils.jsx";

export const data = [{
    month: 'Jan',
    revenue: 155,
    profit: 33
}, {
    month: 'Feb',
    revenue: 123,
    profit: 35.5
}, {
    month: 'Mar',
    revenue: 172.5,
    profit: 41
}];

export const series = [{
    type: 'column',
    xKey: 'month',
    yKeys: ['revenue', 'profit'],
}];

export const getTemplates = (framework, boilerplate, options) => {
    const formattedOptions = deepClone(options);
    formattedOptions.data = data;

    if (!formattedOptions.series) {
        formattedOptions.series = series;
    }

    const optionsJson = formatJson(formattedOptions);
    const boilerplateFiles = boilerplate[framework];

    switch (framework) {
        case 'vanilla':
            return {
                ...boilerplateFiles,
                'main.js': `var options = ${optionsJson};

document.addEventListener('DOMContentLoaded', function() {
    options.container = document.querySelector('#myChart');

    agCharts.AgChart.create(options);
});`
            };
        case 'react':
            return {
                ...boilerplateFiles,
                'index.jsx': `import React, { Component } from "react";
import { render } from "react-dom";
import { AgChartsReact } from "ag-charts-react";

class ChartExample extends Component {
    render() {
        const options = ${optionsJson};

        return <AgChartsReact options={options} />;
    }
}

render(<ChartExample />, document.querySelector("#root"));`
            };
        case 'angular':
            return {
                ...boilerplateFiles,
                'app/app.component.ts': `import { Component } from '@angular/core';
import { AgChartOptions } from 'ag-charts-angular';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html'
})
export class AppComponent {
    options: AgChartOptions;

    constructor() {
        this.options = ${optionsJson};
    }
}`,
                'app/app.component.html': `<ag-charts-angular [options]="options"></ag-charts-angular>`,
                'app/app.module.ts': `import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AgChartsAngularModule } from 'ag-charts-angular';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AgChartsAngularModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}`,
            };
        case 'vue':
            return {
                ...boilerplateFiles,
                'main.js': `import Vue from "vue";
import { AgChartsVue } from "ag-charts-vue";

const VueExample = {
    template: '<ag-charts-vue :options="options"></ag-charts-vue>',
    components: {
        "ag-charts-vue": AgChartsVue
    },
    data: function() {
        return {
            options: {}
        };
    },
    beforeMount() {
        this.options = ${optionsJson};
    },
};

new Vue({
    el: "#app",
    components: {
        "my-component": VueExample
    }
});`
            };
        default:
            return {};
    }
};
