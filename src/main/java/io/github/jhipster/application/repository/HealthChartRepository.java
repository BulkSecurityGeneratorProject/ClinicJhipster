package io.github.jhipster.application.repository;

import io.github.jhipster.application.domain.HealthChart;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the HealthChart entity.
 */
@SuppressWarnings("unused")
@Repository
public interface HealthChartRepository extends JpaRepository<HealthChart, Long> {

}
