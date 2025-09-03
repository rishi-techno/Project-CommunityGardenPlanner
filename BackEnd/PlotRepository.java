 public interface PlotRepository extends JpaRepository<Plot, Long> {
    List<Plot> findByStatus(String status);
}
