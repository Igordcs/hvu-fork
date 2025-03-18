package br.edu.ufape.hvu.controller.dto.request;

import java.time.LocalDateTime;
import br.edu.ufape.hvu.model.enums.TipoFicha;
import org.modelmapper.ModelMapper;
import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Consulta;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;


@Getter @Setter @NoArgsConstructor 
public  class ConsultaRequest  {
	private long id;
	private Double pesoAtual;
	private Double idadeAtual;
	private MedicoRequest medico;
	private boolean proximaConsulta;
	private AnimalRequest animal;
	@DateTimeFormat(pattern = "dd/MM/yyyy hh:mm")
	private LocalDateTime dataVaga;
	private EspecialidadeRequest encaminhamento;
	private FichaRequest ficha;

	public Consulta convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		Consulta obj = modelMapper.map(this, Consulta.class);
		return obj;
	}
}
