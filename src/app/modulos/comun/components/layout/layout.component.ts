import { Component, OnInit, AfterContentInit, ContentChild, ViewChild, ElementRef } from '@angular/core';
import { LayoutMenuComponent } from './layout-menu/layout-menu.component'

import { Empresa } from 'app/modulos/empresa/entities/empresa'
import { Usuario } from 'app/modulos/empresa/entities/usuario'
import { Permiso } from 'app/modulos/empresa/entities/permiso'
import { EmpresaService } from 'app/modulos/empresa/services/empresa.service'
import { SelectItem } from 'primeng/primeng';
import { MenuItem } from 'primeng/primeng';

import { ConfirmationService } from 'primeng/primeng';

import { SesionService } from 'app/modulos/core/services/sesion.service'
import { config } from 'app/config'
import { Router } from '@angular/router';

import { MisTareasComponent } from 'app/modulos/sec/components/mis-tareas/mis-tareas.component';

import { PermisoService } from 'app/modulos/admin/services/permiso.service'
import { AuthService } from '../../../core/auth.service';
import { ConfiguracionGeneralService } from '../../services/configuracion-general.service';
import { ConfiguracionGeneral } from '../../entities/configuracion-general';

 var $: any;
@Component({
	selector: 's-layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.scss'],
	providers: [PermisoService, ConfiguracionGeneralService,MisTareasComponent]
})
export class LayoutComponent implements OnInit, AfterContentInit {

	@ContentChild(LayoutMenuComponent, { static: true }) menuComp: LayoutMenuComponent;
	@ViewChild('header', { static: true }) header;
	@ViewChild('menu', { static: true }) menu;
	@ViewChild('content', { static: true }) content;
	@ViewChild('btnMenu', { static: true }) btnMenu;

	empresasItems: SelectItem[] = [];
	empresaSelect: Empresa;
	empresaSelectOld: Empresa;
	usuario: Usuario;
	items: MenuItem[];
	mapaPermisos: any;
	modalDianostico = false;
	displayModal: boolean;
	tarea: MisTareasComponent;

	data: any;



	constructor(
		private confGenService: ConfiguracionGeneralService,
		private empresaService: EmpresaService,
		private confirmationService: ConfirmationService,
		private router: Router,
		private sesionService: SesionService,
		private permisoService: PermisoService,
		private authService: AuthService,
		private mistareas: MisTareasComponent,
	) {
		

	}
	showNotification(from, align){
		const type = ['','info','success','warning','danger'];
  
		const color = Math.floor((Math.random() * 4) + 1);
  
		$.notify({
			icon: "notifications",
			message: "Welcome to <b>Material Dashboard</b> - a beautiful freebie for every web developer."
  
		},{
			type: type[color],
			timer: 4000,
			placement: {
				from: from,
				align: align
			},
			
		});
	}
	ngOnInit() {
		this.usuario = this.sesionService.getUsuario();
		this.items = [
			{ label: 'Preferencias', icon: 'fa fa-gears', command: (event => this.irPreferencias()) },
			{ label: 'Cerrar sesión', icon: 'fa fa-sign-out', command: (event => this.logout()) }
		];

		this.empresaService.findByUsuario(this.usuario.id).then(
			resp => this.loadItems(<Empresa[]>resp)
		);

		
		setTimeout(() => {
           
            this.cargartareas();
        }, 5000);

	}

	logout() {
		this.authService.logout().then(
			resp => this.router.navigate([''])
		).catch(
			err => {
				//console.log(err);
				alert("Se produjo un error al cerrar sesión, ingresar nuevamente")
			}
		);
	}

	examplemodal() {
		this.modalDianostico = true;
        
	}
	closeCreate() {
        
        this.displayModal = false;
        
    }

	cargartareas(): void {
		
		console.log("aca debe cargar la info");
		this.mistareas.ngOnInit();
		
	  }

	  irtareas(): void {
		this.router.navigate(['app//sec/misTareas']);
	  }

	  

	irPreferencias() {
		this.router.navigate(['app/empresa/usuarioPreferencias']);
	}

	loadItems(empresas: Empresa[]) {
		empresas.forEach(emp => {
			this.empresasItems.push({ label: emp.nombreComercial, value: emp });
		});
		if (this.sesionService.getEmpresa() == null) {
			this.sesionService.setEmpresa(empresas[0]);
		}
		this.empresaSelect = this.sesionService.getEmpresa();
		this.empresaSelectOld = this.empresaSelect;

		this.confGenService.obtenerPorEmpresa()
			.then((resp: ConfiguracionGeneral[]) => {
				let mapaConfig = {};
				resp.forEach(conf => mapaConfig[conf.codigo] = { 'valor': conf.valor, 'nombre': conf.nombre });
				this.sesionService.setConfiguracionMap(mapaConfig);
				this.menuComp.recargarMenu();
			});

		this.permisoService.findAll()
			.then((data: Permiso[]) => {
				this.mapaPermisos = {};
				data.forEach(element => this.mapaPermisos[element.recurso.codigo] = { 'valido': element.valido, 'areas': element.areas });
				this.sesionService.setPermisosMap(this.mapaPermisos);
				this.menuComp.recargarMenu();
			});
	}

	ngAfterContentInit() {

		if (this.menuComp.visible) {
			if (this.menuComp.disabled) {
				this.btnMenu.nativeElement.classList.add('btn-disabled');
				this.btnMenu.nativeElement.disabled = true;
				this.menuComp.expanded = false;
			}
			this.toggleMenu();

		} else {
			this.btnMenu.nativeElement.classList.add('btn-invisible');
			this.btnMenu.nativeElement.disabled = true;
			this.header.nativeElement.classList.add('header-menu-invisible');
			this.content.nativeElement.classList.add('content-full');
			this.menuComp.expanded = false;
		}
	}

	onChangeEmpresa() {
		this.confirmationService.confirm({
			header: '¿Cambiar a la empresa "' + this.empresaSelect.nombreComercial + '"?',
			message: 'Esto reiniciará la sesión actual, ¿Desea continuar?',
			accept: () => {
				this.sesionService.setEmpresa(this.empresaSelect);
				location.reload();
			},
			reject: () => {
				this.empresaSelect = this.empresaSelectOld;
			},
		});
	}















	toggleMenu() {
		this.menuComp.expanded = !this.menuComp.expanded;
		if (this.menuComp.expanded) {
			this.closeMenu();
		} else {
			this.openMenu();
		}
	}

	openMenu() {
		this.menu.expanded = true;
		this.replaceClass(this.header, 'header-partial', 'header-full');
		this.replaceClass(this.content, 'content-partial', 'content-full');
		this.replaceClass(this.menu, 'menu-open', 'menu-close');
		this.replaceClass(this.btnMenu, 'fa-chevron-left', 'fa-bars');
		this.replaceClass(this.btnMenu, 'btn-toggle-menu-open', 'btn-toggle-menu-close');
	}

	closeMenu() {
		this.menu.expanded = false;
		this.replaceClass(this.header, 'header-full', 'header-partial');
		this.replaceClass(this.content, 'content-full', 'content-partial');
		this.replaceClass(this.menu, 'menu-close', 'menu-open');
		this.replaceClass(this.btnMenu, 'fa-bars', 'fa-chevron-left');
		this.replaceClass(this.btnMenu, 'btn-toggle-menu-close', 'btn-toggle-menu-open');
	}

	replaceClass(element: ElementRef, newClass: string, oldClass: string) {
		element.nativeElement.classList.add(newClass);
		element.nativeElement.classList.remove(oldClass);
	}

}
