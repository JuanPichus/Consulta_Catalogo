import { Injectable } from '@angular/core';
import { Producto } from '../modelos/producto';
@Injectable({
  providedIn: 'root',
})
export class Productos {
  private xmlUrl = '/assets/catalogo.xml';
  constructor() {}
  async getProductos(): Promise<Producto[]> {
    try {
      const response = await fetch(this.xmlUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const xmlString = await response.text();
      const productos = this.parseXML(xmlString);
      return productos;
    } catch (error) {
      return [
        //cambiar con forme el catalogo de xml
        { id: 1, nombre: 'Procesador Generico', precio: 8000, marca: 'Carton' },
        {
          id: 2,
          nombre: 'RAM Generica',
          precio: 800,
          marca: 'Teléfono inteligente última generación',
        },
        { id: 3, nombre: 'MOBO Generica', precio: 1000, marca: 'ACME' },
      ];
    }
  }
  private parseXML(xmlString: string): Producto[] {
    try {
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlString, 'text/xml');
      const parseError = xml.querySelector('parsererror');
      if (parseError) {
        throw new Error('XML parsing error: ' + parseError.textContent);
      }
      const productos: Producto[] = [];
      const nodes = xml.getElementsByTagName('producto');
      for (let i = 0; i < nodes.length; i++) {
        //id, nombre, marca, categoria, precio, imagen(direccion)
        const node = nodes[i];
        const idElement = node.getElementsByTagName('id')[0];
        const nombreElement = node.getElementsByTagName('nombre')[0];
        const marcaElement = node.getElementsByTagName('marca')[0];
        const precioElement = node.getElementsByTagName('precio')[0];

        if (idElement && nombreElement && precioElement) {
          const producto: Producto = {
            id: parseInt(idElement.textContent || '0', 10),
            nombre: nombreElement.textContent || 'Sin nombre',
            marca: marcaElement.textContent || 'Sin marca',
            precio: parseFloat(precioElement.textContent || '0'),
          };
          productos.push(producto);
        }
      }
      return productos;
    } catch (error) {
      return [];
    }
  }
}
