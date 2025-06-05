import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { Calificacion } from '../../../models/calificacion';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements OnChanges {
  public chart!: Chart;
  @Input() calificaciones: Calificacion[] | undefined;

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges called with calificaciones:', this.calificaciones);
    if (changes['calificaciones'] && this.calificaciones && this.calificaciones.length > 0) {
      this.createChart();
    }
  }

  createChart() {
    const labels = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    // Helper function to generate random color
    function getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    // Group calificaciones by materia.name
    const grouped: { [key: string]: number[] } = {};
    if (this.calificaciones) {
      this.calificaciones.forEach((calificacion) => {
        const materiaName = calificacion.materia?.name || 'Unknown';
        if (!grouped[materiaName]) {
          grouped[materiaName] = new Array(12).fill(0);
        }
        // Since Calificacion model lacks month info, we will fill data array sequentially for each materia
        const dataArray = grouped[materiaName];
        // Find first zero index to insert grade
        const firstZeroIndex = dataArray.indexOf(0);
        if (firstZeroIndex !== -1) {
          dataArray[firstZeroIndex] = calificacion.grade || 0;
        }
      });
    }

    // Build datasets array
    const datasets = Object.keys(grouped).map((materiaName) => ({
      label: materiaName,
      data: grouped[materiaName],
      fill: false,
      borderColor: getRandomColor(),
      tension: 0.1,
    }));

    const data = {
      labels: labels,
      datasets: datasets,
    };

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('lineChart', {
      type: 'line',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
