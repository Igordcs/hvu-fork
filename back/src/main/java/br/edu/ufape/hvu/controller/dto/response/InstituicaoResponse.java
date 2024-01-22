package br.edu.ufape.hvu.controller.dto.response;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Instituicao;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter @Setter @NoArgsConstructor
public  class InstituicaoResponse  {
	private Long id;
	private String nome;
	private EnderecoResponse endereco; 



	public InstituicaoResponse(Instituicao obj) {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		modelMapper.map(obj, this);	
	}

}
