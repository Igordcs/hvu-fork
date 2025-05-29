package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import br.edu.ufape.hvu.model.MaterialColetado;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.MaterialColetadoRequest;
import br.edu.ufape.hvu.controller.dto.response.MaterialColetadoResponse;

@RestController
@RequestMapping("/api/v1/")
public class MaterialColetadoController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@GetMapping("materialColetado")
	public List<MaterialColetadoResponse> getAllMaterialColetado() {
		return facade.getAllMaterialColetado()
			.stream()
			.map(MaterialColetadoResponse::new)
			.toList();
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@PostMapping("materialColetado")
	public MaterialColetadoResponse createMaterialColetado(@Valid @RequestBody MaterialColetadoRequest newObj) {
		return new MaterialColetadoResponse(facade.saveMaterialColetado(newObj.convertToEntity()));
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@GetMapping("materialColetado/{id}")
	public MaterialColetadoResponse getMaterialColetadoById(@PathVariable Long id) {
		return new MaterialColetadoResponse(facade.findMaterialColetadoById(id));
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@PatchMapping("materialColetado/{id}")
	public MaterialColetadoResponse updateMaterialColetado(@PathVariable Long id, @Valid @RequestBody MaterialColetadoRequest obj) {
			//MaterialColetado o = obj.convertToEntity();
			MaterialColetado oldObject = facade.findMaterialColetadoById(id);

			TypeMap<MaterialColetadoRequest, MaterialColetado> typeMapper = modelMapper
													.typeMap(MaterialColetadoRequest.class, MaterialColetado.class)
													.addMappings(mapper -> mapper.skip(MaterialColetado::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new MaterialColetadoResponse(facade.updateMaterialColetado(oldObject));
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@DeleteMapping("materialColetado/{id}")
	public String deleteMaterialColetado(@PathVariable Long id) {
		facade.deleteMaterialColetado(id);
		return "";
	}
}
