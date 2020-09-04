import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {is_vo} from "../../shared/globalvar";
import * as d3 from 'd3';
import {NumbersService} from "../../api-connector/numbers.service";
import {marginBottom, marginTop} from "html2canvas/dist/types/css/property-descriptors/margin";


@Component({
  selector: 'app-number-charts',
  templateUrl: './number-charts.component.html',
  providers: [NumbersService]
})




/**
 * Test class for charts in Typescript
 */
export class NumberChartsComponent implements OnInit {

  isLoaded: boolean = true;
  is_vo_admin: boolean = true;
  @ViewChild("barChartBodyDiv") barChartBody: ElementRef;
  constructor(private numbersService: NumbersService) {

  }


  private data = [
    {"Framework": "Vue", "Stars": "166443", "Released": "2014"},
    {"Framework": "React", "Stars": "150793", "Released": "2013"},
    {"Framework": "Angular", "Stars": "62342", "Released": "2016"},
    {"Framework": "Backbone", "Stars": "27647", "Released": "2010"},
    {"Framework": "Ember", "Stars": "21471", "Released": "2011"},
  ];

  private chartData;
  private chartKeys;
  private svg;
  private margin = {top: 10, right: 0, bottom: 30, left: 30}
  private width = 750;
  private height = 600;
  // The radius of the pie chart is half the smallest side
  private radius = Math.min(this.width, this.height) / 2 - 50;
  private colors;

  ngOnInit(): void {
    this.getData();
    this.createSvg();
    this.createColors();
    this.drawChart();
  }

  getData(): void {
    this.numbersService.getProjectCounterTimeline().subscribe(
    (result: any): void => {
      this.chartData = result;
      /*this.chartKeys = Object.keys(result[0]);
      console.log(this.chartKeys);*/
      this.drawData();
    }, (err: Error) => {
      console.log(err);
      });
  }

  private createSvg(): void {
    this.svg = d3.select("figure#pie")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr(
        "transform",
        "translate(" + this.width / 2 + "," + this.height / 2 + ")"
      );
  }

  private drawData(): void {

      this.chartKeys = ["total_openstack", "running_simple_vm", "terminated_openstack", "terminated_simple_vm"]
      const stack = d3.stack().keys(this.chartKeys);
      const chartDataToDraw = stack(this.chartData);

    const colors = d3.scaleOrdinal(d3.schemeBuGn[9])
      .domain(this.chartKeys);
    const xScale = d3.scaleBand()
      .domain(this.chartData.map(d=> d["end_date"]))
      .range([this.margin.left, this.width - this.margin.right])
      .padding(0.2);
    const yScale = d3.scaleLinear()
      .domain([0, Number(d3.max(this.chartData, d => d["total"]))])
      .range([this.height - this.margin.bottom, this.margin.top]);
    const xAxis = d3.axisBottom(xScale)
      .tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale);

    
    this.svg = d3.select('figure#bars')
      .attr("width", this.width)
      .attr("height", this.height);

    const groups = this.svg.append('g')
      .selectAll('g')
      .data(chartDataToDraw)
      .join('g')
      .style('fill', (d,i) => colors(d.key));

    groups.selectAll('rect')
      .data(d => d)
      .join('rect')
      .attr('x', d => xScale(d["end_date"]))
      .attr('y', d => yScale(d[1]))
      .attr('height', d => yScale(d[0]) - yScale(d[1]))
      .attr('width', xScale.bandwidth());

    this.svg.append('g')
      .attr('transform', `translate(0,${ this.height - this.margin.bottom })`)
      .call(xAxis);

    this.svg.append('g')
      .attr('transform', `translate(${ this.margin.left },0)`)
      .call(yAxis)
      .select('.domain').remove();



  }



  private createColors(): void {
    this.colors = d3.scaleOrdinal()
      .domain(this.data.map(d => d.Stars.toString()))
      .range(["#c7d3ec", "#a5b8db", "#879cc4", "#677795", "#5a6782"]);
  }

  private drawChart(): void {
    // Compute the position of each group on the pie:
    const pie = d3.pie<any>().value((d: any) => Number(d.Stars));

    // Build the pie chart
    this.svg
      .selectAll('pieces')
      .data(pie(this.data))
      .enter()
      .append('path')
      .attr('d', d3.arc()
        .innerRadius(0)
        .outerRadius(this.radius)
      )
      .attr('fill', (d, i) => (this.colors(i)))
      .attr("stroke", "#121926")
      .style("stroke-width", "1px");

    // Add labels
    const labelLocation = d3.arc()
      .innerRadius(100)
      .outerRadius(this.radius);

    this.svg
      .selectAll('pieces')
      .data(pie(this.data))
      .enter()
      .append('text')
      .text(d => d.data.Framework)
      .attr("transform", d => "translate(" + labelLocation.centroid(d) + ")")
      .style("text-anchor", "middle")
      .style("font-size", 15);
  }

}
