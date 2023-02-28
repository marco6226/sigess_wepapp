import { Component, OnInit, AfterContentInit, ContentChild, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { LayoutMenuComponent } from './layout-menu/layout-menu.component'

import { Empresa } from 'app/modulos/empresa/entities/empresa'
import { Empleado } from 'app/modulos/empresa/entities/empleado';
import { EmpleadoService } from 'app/modulos/empresa/services/empleado.service';
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
import { HelperService } from 'app/modulos/core/services/helper.service';

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
	empleado:Empleado;
	items: MenuItem[];
	mapaPermisos: any;
	modalDianostico = false;
	displayModal: boolean;
	tarea: MisTareasComponent;
	public tareasPendientes: any;

	data: any;
	position: number=window.innerWidth-400;
	pos:number=1500;

	actualizarPermisos: any;

	constructor(
		private confGenService: ConfiguracionGeneralService,
		private empresaService: EmpresaService,
		private empleadoService: EmpleadoService,
		private confirmationService: ConfirmationService,
		private router: Router,
		private sesionService: SesionService,
		private permisoService: PermisoService,
		private authService: AuthService,
		private mistareas: MisTareasComponent,
		private helperService: HelperService
	) {
		

	}
	test(){
		console.log(this.empresaSelect.logo)
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
	async ngOnInit() {
		this.helperService.customMessage.subscribe(msg => this.actualizarPermisos = msg);

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
		this.ActPosition();

		setTimeout(() => {           
			this.closeMenu();
        }, 10000);

		setInterval(()=>{
			if(this.actualizarPermisos==true){
				console.log('Recargando Menú');
				this.menuComp.recargarMenu();
				this.helperService.changeMessage(false);
				this.permisoService.findAll()
				.then((data: Permiso[]) => {
					this.mapaPermisos = {};
					data.forEach(element => this.mapaPermisos[element.recurso.codigo] = { 'valido': element.valido, 'areas': element.areas });
					this.sesionService.setPermisosMap(this.mapaPermisos);
					console.log(this.mapaPermisos);
					this.menuComp.recargarMenu();
				});
			}
		}, 2000)
	}

	logout() {
		this.authService.logout().then(
			resp => this.router.navigate(['/login'])
		).catch(
			err => {
				
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
	
	
	async cargartareas(){//: void {
		
			
		        
		this.mistareas.ngOnInit();
        
		//this.nom= this.mistareas.ngOnInit() as any;
		setTimeout(() => {           
			this.tareasPendientes= this.mistareas.devolverEstados()
        }, 500);
		
		
		
		return this.tareasPendientes
	  }

	  irtareas(): void {
		this.router.navigate(['app//sec/misTareas']);
	  }

	  

	irPreferencias() {
		this.router.navigate(['app/empresa/usuarioPreferencias']);
	}

	async loadItems(empresas: Empresa[]) {
		empresas.forEach(emp => {
			this.empresasItems.push({ label: emp.nombreComercial, value: emp });
		});
		if (this.sesionService.getEmpresa() == null) {
			await this.sesionService.setEmpresa(empresas[0]);
		}
		this.empresaSelect = await this.sesionService.getEmpresa();
		this.empresaSelectOld = this.empresaSelect;

		this.confGenService.obtenerPorEmpresa()
			.then((resp: ConfiguracionGeneral[]) => {
				let mapaConfig = {};
				resp.forEach(conf => mapaConfig[conf.codigo] = { 'valor': conf.valor, 'nombre': conf.nombre });
				this.sesionService.setConfiguracionMap(mapaConfig);
				this.menuComp.recargarMenu();
			});

			await this.permisoService.findAll()
			.then((data: Permiso[]) => {
				this.mapaPermisos = {};
				data.forEach(element => this.mapaPermisos[element.recurso.codigo] = { 'valido': element.valido, 'areas': element.areas });
				this.sesionService.setPermisosMap(this.mapaPermisos);
				this.menuComp.recargarMenu();
			});

			         
				await this.empleadoService.findempleadoByUsuario(this.usuario.id).then(
					resp => {
					  this.empleado = <Empleado>(resp);					  
					  this.sesionService.setEmpleado(this.empleado);
					}
				  );

			
			
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
			accept: async() => {
				await this.sesionService.setEmpresa(this.empresaSelect);				
				//await location.reload();
				await this.router.navigate([('/app/home')]);
				await location.reload();
				           
					
				//this.router.navigate([('/app/home')]);
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
	
	ActPosition(){
		this.position =window.innerWidth-400;
	}
}
