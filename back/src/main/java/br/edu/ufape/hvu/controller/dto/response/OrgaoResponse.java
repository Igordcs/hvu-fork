package br.edu.ufape.hvu.controller.dto.response;

import java.util.List;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Orgao;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter @Setter @NoArgsConstructor
public  class OrgaoResponse  {
	private Long id;
	private String image_path;
	private String nome;
	private Boolean sexoMacho;
	private Boolean sexoFemea;
	private FotoResponse foto; 
	private List<AreaResponse> area; 



	public OrgaoResponse(Orgao obj) {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		modelMapper.map(obj, this);	
	}

}
